<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $casts = [
        'featured' => 'boolean',
        'tags' => 'array',
        'content' => 'string',
        'created_at' => 'datetime',
    ];

    protected $fillable = [
        'title',
        'content',
        'author',
        'featured',
        'tags',
        'thumbnail',
    ];

    public function getExcerptAttribute()
    {
        return Str::limit(strip_tags($this->content), 150);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($blog) {
            $blog->slug = Str::slug($blog->title);
            
            // If no thumbnail provided for AI-generated posts, we could set a default
            if (empty($blog->thumbnail)) {
                $blog->thumbnail = 'default-ai-blog-thumbnail.jpg'; // Make sure this file exists in your storage
            }
        });
        
        static::updating(function ($blog) {
            if ($blog->isDirty('title')) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }
}
