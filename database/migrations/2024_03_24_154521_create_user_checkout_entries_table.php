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
        Schema::create('user_checkout_entries', function (Blueprint $table) {
            $table->id();
            // objective_entry_id
            $table->foreignId('objective_entry_id')->constrained()->onDelete('cascade');

            // user_id
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // status ( 0 = pending, 1 = completed, )
            $table->tinyInteger('status')->default(0);
            // completed_at
            $table->timestamp('completed_at')->nullable();

            // info_data
            $table->json('info_data')->nullable();
            // file path
            $table->string('file_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_checkout_entry');
    }
};
