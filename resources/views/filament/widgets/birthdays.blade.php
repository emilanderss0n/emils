<x-filament-widgets::widget>
    <x-filament::section>
        <div class="flex flex-col space-y-4 birthdays-widget-admin">
            <div class="flex items-center justify-between">
                <h2 class="grid flex-1 text-base font-semibold leading-6 text-gray-950 dark:text-white">Upcoming Birthdays</h2>
            </div>
            
            @if($contacts->isEmpty())
                <div class="flex justify-center">
                    <x-filament::badge>
                        No upcoming birthdays in the next month
                    </x-filament::badge>
                </div>
            @else
                <div class="flex birthdays-list-admin">
                    @foreach($contacts as $contact)
                        <div class="birthday-item-admin">
                            @if($contact->contact_image)
                                <img src="{{ Storage::url($contact->contact_image) }}" 
                                    alt="{{ $contact->full_name }}" 
                                    class="birthday-item-image-admin"
                                >
                            @else
                                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <x-filament::icon
                                        name="heroicon-o-user"
                                        class="w-6 h-6 text-gray-400"
                                    />
                                </div>
                            @endif
                            
                            <div class="birthday-item-details-admin flex items-center gap-2">
                                <div>
                                    <div class="birthday-item-details-admin-name font-medium">{{ $contact->full_name }}</div>
                                    <div class="birthday-item-details-admin-date {{ $this->isBirthdayToday($contact->birthday) ? 'text-success-500' : $this->getUpcomingColor($contact->birthday) }}">
                                        @if($this->isBirthdayToday($contact->birthday))
                                            @svg('heroicon-o-cake', 'birthday-item-icon-admin text-success-500')
                                        @endif
                                        {{ Carbon\Carbon::parse($contact->birthday)->format('M d') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
