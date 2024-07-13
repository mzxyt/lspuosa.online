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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string("question_type");
            $table->boolean("isQRequired")->default(true);
            $table->boolean("isERequired")->default(true);
            $table->boolean("isTRequired")->default(true);
            $table->text("target_indicators")->nullable();
            $table->text("remarks")->nullable();
            $table->text("efficiency")->nullable();
            $table->text("supporting_documents")->nullable();
            $table->text("individuals_accountable")->nullable();
            $table->text("title");

            // edited by
            $table->foreignId("user_id")->nullable()->constrained();
            // edited at
            $table->timestamp("edited_at")->nullable();

            // is_archived
            $table->boolean("isArchived")->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
