<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Work extends Model
{
    use HasFactory;

    protected $casts = [
        'images' => 'array',
        'project_date' => 'date',
        'ongoing' => 'boolean',
        'featured' => 'boolean',
    ];

    protected $fillable = [
        'name',
        'description',
        'content',
        'thumbnail',
        'images',
        'live_url',
        'project_date',
        'ongoing',
        'featured',
        'slug'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getRouteKey()
    {
        return $this->{$this->getRouteKeyName()};
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($work) {
            $work->slug = Str::slug($work->name);
        });
        
        static::updating(function ($work) {
            if ($work->isDirty('name')) {
                $work->slug = Str::slug($work->name);
            }
        });
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }
}
