<?php

namespace App\Mail;

use App\Models\NewsletterTemplate;
use App\Models\Blog;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscriber;

class Newsletter extends Mailable
{
    use Queueable, SerializesModels;

    public ?Subscriber $subscriber = null;
    public $latestPosts;

    public function __construct(public NewsletterTemplate $template, ?Subscriber $subscriber = null)
    {
        $this->subscriber = $subscriber;
        $this->latestPosts = Blog::orderBy('created_at', 'desc')
                                ->take(3)
                                ->get();
    }

    public function build()
    {
        return $this->subject($this->template->subject)
                    ->view('emails.newsletter')
                    ->with([
                        'template' => $this->template,
                        'subscriber' => $this->subscriber,
                        'latestPosts' => $this->latestPosts,
                    ]);
    }
}