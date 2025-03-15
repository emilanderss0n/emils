<x-filament-panels::page>

        <div class="mb-4">
            <h2 class="text-xl font-bold tracking-tight">Generate AI Blog Post</h2>
            <p class="text-gray-500 dark:text-gray-400">
                Fill out the form below and click "Generate" to create a new blog post using the chosen AI provider.
            </p>
        </div>

        <x-filament-panels::form wire:submit="generate">
            {{ $this->form }}
            
            <div class="mt-6">
                <button 
                    type="submit" 
                    class="fi-btn fi-btn-size-lg fi-btn-color-primary relative inline-grid grid-flow-col items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold outline-none transition duration-75 fi-color-custom fi-btn-color-primary hover:bg-primary-600 dark:hover:bg-primary-400 focus-visible:bg-primary-600 dark:focus-visible:bg-primary-400 fi-color-primary bg-primary-600 text-white dark:bg-primary-500 dark:text-primary-50"
                    wire:loading.attr="disabled"
                    wire:target="generate"
                >
                    <div class="flex items-center gap-1.5">
                        <!-- Removed the icon in non-loading state -->
                        <span wire:loading wire:target="generate">
                            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        <span wire:loading.remove wire:target="generate">Generate</span>
                        <span wire:loading wire:target="generate">Generating...</span>
                    </div>
                </button>
            </div>
        </x-filament-panels::form>
        
</x-filament-panels::page>
