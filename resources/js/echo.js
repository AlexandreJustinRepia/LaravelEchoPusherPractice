import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher globally available
window.Pusher = Pusher;

// Attach Echo to window
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
});

export const echo = window.Echo;
