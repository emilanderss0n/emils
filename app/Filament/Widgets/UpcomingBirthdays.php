<?php

namespace App\Filament\Widgets;

use App\Models\Contact;
use Filament\Widgets\Widget;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;

class UpcomingBirthdays extends Widget
{
    protected static ?int $sort = -1;
    protected static bool $isLazy = false;

    protected function getContacts()
    {
        return Contact::query()
            ->where('user_id', auth()->id())
            ->whereNotNull('birthday')
            ->whereRaw('
                DATE_ADD(
                    birthday,
                    INTERVAL YEAR(CURDATE())-YEAR(birthday) + IF(
                        DAYOFYEAR(CURDATE()) > DAYOFYEAR(birthday),
                        1,
                        0
                    ) YEAR
                )
                BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
            ')
            ->orderByRaw('DAYOFYEAR(birthday)')
            ->get();
    }

    protected function getUpcomingColor(string $birthday): string
    {
        $nextBirthday = Carbon::parse($birthday)->setYear(now()->year);
        
        if ($nextBirthday->isPast()) {
            $nextBirthday->addYear();
        }

        $daysUntilBirthday = now()->diffInDays($nextBirthday, false);

        return ($daysUntilBirthday >= 0 && $daysUntilBirthday <= 7) ? 'text-success-500' : 'text-gray-500';
    }

    protected function isBirthdayToday(string $birthday): bool
    {
        $birthdayDate = Carbon::parse($birthday);
        $today = now();
        
        return $birthdayDate->month === $today->month && 
               $birthdayDate->day === $today->day;
    }

    public function render(): View
    {
        return view('filament.widgets.birthdays', [
            'contacts' => $this->getContacts(),
        ]);
    }
}
