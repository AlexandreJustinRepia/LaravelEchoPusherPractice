// resources/js/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher globally available
window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,        // frontend key
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // frontend cluster
    forceTLS: true,                                   // always true for HTTPS
    encrypted: true,
});
