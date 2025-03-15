<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        if ($request->is('throttled')) {
            return back()->with('error', 'Please wait 1 minute before sending another message.');
        }

        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'message' => 'required'
        ]);

        try {
            Mail::to('hello@emils.graphics')->send(new ContactFormMail($request->all()));
            return redirect()->back()->with('success', 'Thank you for your message. We will get back to you soon!');
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Sorry, there was an error sending your message.')->withInput();
        }
    }
}
