<?php

namespace App\Filament\Resources\NewsletterTemplateResource\Pages;

use App\Filament\Resources\NewsletterTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNewsletterTemplate extends EditRecord
{
    protected static string $resource = NewsletterTemplateResource::class;

    public function getTitle(): string 
    {
        return 'Edit Newsletter';
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}