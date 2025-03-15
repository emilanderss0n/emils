<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    protected $fillable = [
        'title',
        'slug',
        'author',
        'content',
        'thumbnail',
        'featured',
        'tags'
    ];

    protected $casts = [
        'featured' => 'boolean',
        'tags' => 'array'
    ];
}
