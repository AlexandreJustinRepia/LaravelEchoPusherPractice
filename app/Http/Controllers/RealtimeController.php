<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class RealtimeController extends Controller
{
    public function inputNotif()
    {
        return view('test-notif');
    }

    public function sendNotif()
    {
        return Inertia::render('SendNotification', [
            'users' => User::select('id', 'name')->get()
        ]);
    }
}
