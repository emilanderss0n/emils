<x-filament-panels::page>
    <form wire:submit="submit" class="user-settings-form">
        {{ $this->form }}
 
        <x-filament::button type="submit" class="mt-4">
            Save changes
        </x-filament::button>
    </form>
</x-filament-panels::page>
