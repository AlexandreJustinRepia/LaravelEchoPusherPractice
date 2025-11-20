<?

use Illuminate\Http\Request;
use App\Events\ChatMessageSent;
use Illuminate\Support\Facades\Route;

Route::post('/send-message', function (Request $request) {
    event(new ChatMessageSent($request->message, $request->sender));
    return response()->json(['status' => 'ok']);
});