@php
    // Force filter to be 'LTD' and hide the dropdown completely
    if (!isset($hideDateFilter)) {
        $hideDateFilter = true;
    }
    $this->filter = 'LTD';
@endphp

<x-filament-widgets::widget>
    <x-filament::section>
        <div class="flex items-center justify-between gap-x-3">
            <div>
                <h2 class="text-lg sm:text-xl font-bold tracking-tight">
                    {{ $this->getHeading() }} <span class="text-sm font-normal">(Last 30 Days)</span>
                </h2>

                @if ($filters = $this->getFilters())
                    @if (!$hideDateFilter)
                        <div class="flex gap-x-3">
                            <span class="text-sm text-gray-500 font-medium dark:text-gray-400">
                                {{ $this->getDescription() }}
                            </span>

                            <x-filament::input.wrapper
                                inline-prefix
                                wire:target="filter"
                            >
                                <x-filament::input.select
                                    inline-prefix
                                    wire:model.live="filter"
                                >
                                    @foreach ($filters as $value => $label)
                                        <option value="{{ $value }}">
                                            {{ $label }}
                                        </option>
                                    @endforeach
                                </x-filament::input.select>
                            </x-filament::input.wrapper>
                        </div>
                    @else
                        <span class="text-sm text-gray-500 font-medium dark:text-gray-400">
                            {{ $this->getDescription() }}
                        </span>
                    @endif
                @endif
            </div>

            <div>
                {{ $this->getHeaderAction() }}
            </div>
        </div>

        {{ $slot }}
    </x-filament::section>
</x-filament-widgets::widget>
