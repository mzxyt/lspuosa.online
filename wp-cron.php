<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('queue:work --sansdaemon --tries=3',function(){});

?>