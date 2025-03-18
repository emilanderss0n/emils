<?php

namespace App\Filament\Resources\BlogResource\Pages;

use App\Filament\Resources\BlogResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBlog extends CreateRecord
{
    protected static string $resource = BlogResource::class;
    
    // Add navigation properties
    protected static ?string $navigationLabel = 'Write Post';
    protected static ?string $navigationIcon = 'heroicon-o-pencil-square';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?int $navigationSort = 3;
    
    public static function getNavigationUrl(array $parameters = []): string
    {
        return static::$resource::getUrl('create');
    }

    public static function shouldRegisterNavigation(array $parameters = []): bool
    {
        return true;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
