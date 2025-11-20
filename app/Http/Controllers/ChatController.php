<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\ChatMessageSent;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function noAuthChatRoom()
    {
        return Inertia::render('NoAuthChatRoom');
    }
    public function sendMessage(Request $request)
    {
        event(new ChatMessageSent($request->message, $request->sender));

        return response()->json(['status' => 'Message broadcasted']);
    }
}
