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
        Schema::create('report_entries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('duration');
            $table->json('participants');
            $table->boolean('budget');
            $table->string('conducted_by');
            $table->string('location');
            $table->json('documentation');
            $table->date('date');
            $table->string('event_name');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('report_id');
            $table->foreign('report_id')->references('id')->on('reports')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_entries');
    }
};
