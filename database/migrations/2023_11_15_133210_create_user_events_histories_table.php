<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_events_histories', function (Blueprint $table) {
            $table->id();
            // user, campus, office, event, description,
            $table->string('user_name');
            $table->string('event_name');
            $table->string('campus_name')->nullable();
            $table->string('office_name')->nullable();
            $table->string('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_events_histories');
    }
};
