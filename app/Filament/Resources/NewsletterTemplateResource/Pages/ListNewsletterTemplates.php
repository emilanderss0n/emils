<?php

namespace App\Filament\Resources\NewsletterTemplateResource\Pages;

use App\Filament\Resources\NewsletterTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNewsletterTemplates extends ListRecords
{
    protected static string $resource = NewsletterTemplateResource::class;
    
    public function getTitle(): string 
    {
        return 'Newsletters';
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Create Newsletter'),
        ];
    }
}