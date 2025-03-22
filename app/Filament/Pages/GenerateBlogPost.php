<?php

namespace App\Filament\Pages;

use App\Models\Blog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Filament\Actions\Action;
use Illuminate\Support\Str;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Illuminate\Support\Facades\Log;

use Filament\Forms\Components\Placeholder;
use Illuminate\Support\HtmlString;

class GenerateBlogPost extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-sparkles';
    protected static ?string $navigationLabel = 'Generate Post';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?string $title = 'AI Article Generator';
    protected static ?int $navigationSort = 2;
    protected static string $view = 'filament.pages.generate-blog-post';
    
    public ?array $data = [];
    
    public function mount(): void
    {
        $this->form->fill();
    }
    
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Post Details')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Post Title')
                            ->required(),
                        Forms\Components\TextInput::make('author')
                            ->label('Author')
                            ->default('Moxo')
                            ->hidden(),
                        Forms\Components\Select::make('tone')
                            ->label('Writing Tone')
                            ->options([
                                'professional' => 'Professional',
                                'casual' => 'Casual',
                                'humorous' => 'Humorous',
                                'educational' => 'Educational',
                                'technical' => 'Technical',
                            ])
                            ->default('professional'),
                        Forms\Components\TextInput::make('tags')
                            ->label('Tags (comma-separated)')
                            ->required(),
                        Forms\Components\Select::make('model')
                            ->label('AI Model')
                            ->options([
                                'gpt-4o-mini' => 'GPT-4o Mini (Balanced)',
                                'gpt-4o' => 'GPT-4o (High Quality)',
                            ])
                            ->default('gpt-4o-mini'),
                        Forms\Components\Textarea::make('prompt')
                            ->label('Prompt for AI')
                            ->required()
                            ->rows(4),
                        Placeholder::make('Model Pricing')
                            ->content(new HtmlString('Per 1M tokens:<ul><li>GPT-4o Mini - Input: $0.15 - Output: $0.60</li><li>GPT-4o - Input: $2.50 - Output: $10.00</li></ul>')),
                    ])
                    ->columns(2),
            ])
            ->statePath('data');
    }
    
    public function generate(): void
    {
        $data = $this->form->getState();
        
        try {
            Log::info('Starting blog generation with data', ['data' => $data]);
            
            // Updated prompt with very explicit instructions about HTML tags
            $prompt = "Write the content for a blog post titled \"{$data['title']}\" with a {$data['tone']} tone. " . 
                      "The blog post should be about: {$data['prompt']}. " . 
                      "VERY IMPORTANT: Format your response with the following HTML tags:\n" .
                      "- Use <h2> tags for section headings\n" .
                      "- Use <p> tags for paragraphs\n" .
                      "- Use <ul> and <li> tags for lists\n" .
                      "- Use <strong> or <em> tags for emphasis\n\n" .
                      "Do NOT include any HTML document structure tags (no <!DOCTYPE>, <html>, <head>, <body>, etc).\n" .
                      "Do NOT include the title as an <h1> heading - the title is handled separately.\n" .
                      "Start directly with the introduction paragraph wrapped in <p> tags, followed by sections with <h2> headings.\n" .
                      "Write a comprehensive blog post with at least 3 sections, each with its own <h2> heading.";
            
            // Get the selected model or default to gpt-4o-mini if not set
            $model = $data['model'] ?? 'gpt-4o-mini';
            Log::info('Sending prompt to OpenAI', ['prompt' => $prompt, 'model' => $model]);
            
            // Add a loading notification
            Notification::make()
                ->title('Generating blog post...')
                ->body('Please wait while AI generates your content. This may take up to 30 seconds.')
                ->info()
                ->send();
                
            // Generate content using Prism with retry logic and selected model
            $response = $this->generateWithRetry(
                Provider::OpenAI, 
                $model,
                "You are a professional blog writer. Your task is to create engaging, well-structured blog posts. Do not include any HTML doctype, head, body tags, or h1 headings in your response.",
                $prompt
            );
                
            $content = $response->text;
                
            // Clean up the HTML content and ensure proper formatting
            $content = $this->cleanupHtmlContent($content);
            
            // If the content has no HTML tags, add them programmatically
            if (!preg_match('/<\w+>/', $content)) {
                $content = $this->ensureHtmlFormatting($content);
            }
            
            Log::info('Content generated successfully', ['contentLength' => strlen($content)]);
            
            // Create the blog post
            $tags = !empty($data['tags']) 
                ? array_map('trim', explode(',', $data['tags'])) 
                : [];
                
            $blog = Blog::create([
                'title' => $data['title'],
                'content' => $content,
                'author' => $data['author'] ?? 'Moxo', // Add default value when author is not in the form data
                'featured' => false,
                'tags' => $tags,
            ]);
            
            Log::info('Blog post created successfully', ['blog_id' => $blog->id]);
            
            Notification::make()
                ->title('Blog post generated successfully!')
                ->success()
                ->send();
                
            $this->redirect(route('filament.admin.resources.blogs.index'));
            
        } catch (\Exception $e) {
            Log::error('Error generating blog post', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $errorMsg = $e->getMessage();
            $detailedMsg = $errorMsg;
            
            // Provide more helpful error messages
            if (strpos($errorMsg, 'rate limit') !== false) {
                $detailedMsg = "Rate limit error encountered. Please try again in a few moments.\n\n" .
                              "Error details: " . $errorMsg;
            }
            
            Notification::make()
                ->title('Blog Generation Failed')
                ->body($detailedMsg)
                ->danger()
                ->persistent()
                ->actions([
                    \Filament\Notifications\Actions\Action::make('retry')
                        ->label('Try Again')
                        ->color('primary')
                        ->button()
                        ->url(self::getUrl()),
                ])
                ->send();
        }
    }
    
    /**
     * Clean up HTML content to remove unwanted structure elements while preserving important formatting
     */
    protected function cleanupHtmlContent(string $content): string
    {
        // Remove DOCTYPE declaration if present
        $content = preg_replace('/<!DOCTYPE.*?>/i', '', $content);
        
        // Remove full HTML document structure elements only
        $content = preg_replace('/<html.*?>|<\/html>/i', '', $content);
        $content = preg_replace('/<head>.*?<\/head>/is', '', $content);
        
        // Only remove opening and closing body tags, keep their content
        $content = preg_replace('/<body.*?>/i', '', $content);
        $content = preg_replace('/<\/body>/i', '', $content);
        
        // Remove title tags
        $content = preg_replace('/<title>.*?<\/title>/i', '', $content);
        
        // Remove header tags containing h1 elements
        $content = preg_replace('/<header>\s*<h1.*?>.*?<\/h1>\s*<\/header>/is', '', $content);
        
        // Remove h1 tags specifically
        $content = preg_replace('/<h1.*?>.*?<\/h1>/is', '', $content);
        
        // Remove footer tags if present, but keep their content
        $content = preg_replace('/<footer>/i', '', $content);
        $content = preg_replace('/<\/footer>/i', '', $content);
        
        // Remove meta tags
        $content = preg_replace('/<meta.*?>/i', '', $content);
        
        // If the AI returned content wrapped in <article> or similar tags, keep their content
        $content = preg_replace('/<article.*?>|<\/article>/i', '', $content);
        
        // Remove any script or style tags completely with their content
        $content = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i', '', $content);
        $content = preg_replace('/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/i', '', $content);
        
        // Clean up any multiple consecutive newlines/whitespace
        $content = preg_replace('/(\s{2,})/s', "\n\n", $content);
        
        // Trim whitespace from beginning and end
        $content = trim($content);
        
        // If the content has become completely empty, add a placeholder
        if (empty($content)) {
            $content = '<p>Content generation failed to produce valid HTML. Please try again.</p>';
        }
        
        return $content;
    }
    
    /**
     * Ensure that content has proper HTML tags even if AI returned plain text
     */
    protected function ensureHtmlFormatting(string $content): string
    {
        // If completely empty, return placeholder
        if (empty($content)) {
            return '<p>Content generation failed to produce valid content. Please try again.</p>';
        }
        
        $formattedContent = '';
        $paragraphs = preg_split('/\n{2,}/', $content);
        
        foreach ($paragraphs as $paragraph) {
            $paragraph = trim($paragraph);
            
            // Skip empty paragraphs
            if (empty($paragraph)) continue;
            
            // Check if paragraph is a heading (ends with : or is short)
            if (preg_match('/^(.*?):$/m', $paragraph, $matches) || 
                (strlen($paragraph) < 100 && strpos($paragraph, '.') === false)) {
                // Remove "Section X:" prefixes if they exist
                $heading = preg_replace('/^(Section \d+:|Introduction:|Conclusion:)\s*/i', '', $paragraph);
                $formattedContent .= "<h2>{$heading}</h2>\n";
            } else {
                // Handle bullet points
                if (preg_match_all('/^\s*[\-\*]\s+(.*)$/m', $paragraph, $matches)) {
                    $formattedContent .= "<ul>\n";
                    foreach ($matches[1] as $bullet) {
                        $formattedContent .= "  <li>{$bullet}</li>\n";
                    }
                    $formattedContent .= "</ul>\n";
                } else {
                    // Regular paragraph
                    $formattedContent .= "<p>{$paragraph}</p>\n";
                }
            }
        }
        
        return $formattedContent;
    }
    
    /**
     * Try to generate AI content with retry logic
     */
    protected function generateWithRetry($provider, $model, $systemPrompt, $prompt, $retries = 2)
    {
        $attempt = 0;
        $maxAttempts = $retries + 1;
        
        while ($attempt < $maxAttempts) {
            try {
                if ($attempt > 0) {
                    // Add a delay between retries to avoid rate limits
                    sleep(3 * $attempt);
                    Log::info("Retry attempt {$attempt} for generation");
                }
                
                return Prism::text()
                    ->using($provider, $model)
                    ->withSystemPrompt($systemPrompt)
                    ->withPrompt($prompt)
                    ->generate();
            } catch (\Exception $e) {
                $attempt++;
                
                // If this was our last attempt, throw the error
                if ($attempt >= $maxAttempts) {
                    throw $e;
                }
                
                // Otherwise, log and retry
                Log::warning("Generation attempt {$attempt} failed: " . $e->getMessage());
            }
        }
    }
}
