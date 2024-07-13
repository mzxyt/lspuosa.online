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
        Schema::create('objective_entries', function (Blueprint $table) {
            $table->id();
            // objective id
            $table->foreignId('objective_id')->constrained('objectives')->cascadeOnDelete();

            // title
            $table->string('title');

            // description
            $table->text('description');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('objective_entries');
    }
};
