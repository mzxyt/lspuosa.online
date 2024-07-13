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
        Schema::create('qetas', function (Blueprint $table) {
            $table->id();
            // different number for different title
            $table->string('mfa_type');

            // connect to questions
            $table->foreignId('question_id')
                ->constrained('questions')->onDelete('cascade');

            // rating
            $table->float('q')->nullable();
            $table->float('e')->nullable();
            $table->float('t')->nullable();
            $table->float('a')->nullable();

            // opcr_id
            $table->foreignId('opcr_id')->nullable()
                ->constrained('opcrs')->onDelete('cascade');

            // remarks
            $table->string('actual_accomplishments')->nullable();

            // alloted_budgets
            $table->float('alloted_budgets')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qetas');
    }
};
