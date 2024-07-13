<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('annual_reports', function (Blueprint $table) {
            $table->id();

            // generated_by
            // $table->foreignId('generated_by')->constrained('users');
            $table->string('generated_by');
            // timestamp generated_at
            $table->timestamp('generated_at')->useCurrent();

            // data 
            $table->json('data');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annual_reports');
    }
};
