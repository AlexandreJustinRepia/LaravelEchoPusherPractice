<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RealtimeController;
use App\Events\SampleEvent;
use Illuminate\Http\Request;
use App\Events\ChatMessageSent;
use App\Http\Controllers\ChatController;
use App\Events\AuthNotification;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/test-notif', function () {
    return view('test-notif');
});

Route::post('/send-notif', function (Request $request) {
    $message = $request->input('message', 'Hello World!');
    $data = [
        'message' => $message,
        'time' => now()->toDateTimeString()
    ];

    broadcast(new SampleEvent($data));

    return response()->json(['status' => 'success', 'data' => $data]);
});

//No Auth Chat
Route::get('/chat-room', [ChatController::class, 'noAuthChatRoom']);

Route::post('/send-message', function (Request $request) {
    event(new ChatMessageSent($request->message, $request->sender));
    return response()->json(['status' => 'ok']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/send-notification', [RealtimeController::class, 'sendNotif']);

    Route::post('/notify-user', function (Request $request) {
        event(new AuthNotification($request->message, $request->userId));
        return back()->with('success', 'Notification sent!');
    });
});

require __DIR__.'/auth.php';

Route::middleware('auth')->post('/private-send', function (\Illuminate\Http\Request $request) {
    event(new \App\Events\PrivateChatMessage(
        $request->message,
        auth()->id(),
        $request->receiverId
    ));

    return response()->json(['status' => 'sent']);
});

Route::middleware('auth')->get('/auth-chat', function () {
    return Inertia::render('AuthChat', [
        'users' => \App\Models\User::select('id','name')->get(),
        'auth' => ['user' => auth()->user()]
    ]);
});