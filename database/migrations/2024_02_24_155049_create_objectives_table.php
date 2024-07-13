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
        Schema::create('objectives', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            //    designation id
            $table->foreignId('designation_id')->constrained('designations');

            // due date
            $table->date('due_date');

            // campus id : nullable
            $table->foreignId('campus_id')->nullable()->constrained('campuses')->nullOnDelete();

            $table->integer('objective_type'); // 1 for submission functionality checking where it is automated, 2 for user manual checking where the user can the ability to mark it as completed,
            // constrain to submission bin for checking if the user has submitted the task : note that this is nullable so it will be pointed to a specific submission bin to check if the user has submitted the task
            $table->foreignId('submission_bin_id')->nullable()->constrained('submission_bins')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('objectives');
    }
};
