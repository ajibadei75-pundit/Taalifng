/* Taalif NG | Registers the service worker on HTTPS or localhost */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
