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
        Schema::create('submission_bins', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('status');
            $table->string('title');
            $table->string('instruction');
            // campus_id is the foreign key which is nullable
            $table->foreignId('campus_id')->nullable()->constrained()->nullOnDelete();

            // designation_id is the foreign key which is nullable
            $table->foreignId('designation_id')->nullable()->constrained()->nullOnDelete();

            $table->date('deadline_date');
            $table->time('deadline_time');
            $table->boolean('has_deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_bins');
    }
};
