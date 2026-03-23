-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "subtitle" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(32) NOT NULL,
    "base_price" INTEGER NOT NULL,
    "consultation_price" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'GBP',
    "billing_cycle" VARCHAR(4) NOT NULL DEFAULT 'mo',
    "features" TEXT[],
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(32) NOT NULL,
    "product_id" VARCHAR(64) NOT NULL,
    "order_type" VARCHAR(16) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "quality" VARCHAR(16) NOT NULL DEFAULT 'standard',
    "turnaround" VARCHAR(16) NOT NULL DEFAULT 'standard',
    "total_price" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'GBP',
    "delivery_days" INTEGER NOT NULL,
    "customer_name" VARCHAR(120) NOT NULL,
    "customer_email" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(30) NOT NULL,
    "stripe_session_id" TEXT,
    "status" VARCHAR(24) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" VARCHAR(32) NOT NULL,
    "order_id" VARCHAR(32) NOT NULL,
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_stages" (
    "id" TEXT NOT NULL,
    "transaction_id" VARCHAR(32) NOT NULL,
    "stage_key" VARCHAR(32) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'upcoming',
    "completed_at" TIMESTAMP(3),
    "estimated_date" TIMESTAMP(3),
    "details" TEXT[],
    "deliverables" TEXT[],
    "assigned_to" VARCHAR(120),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultancy_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charity_projects" (
    "id" TEXT NOT NULL,
    "charity_name" VARCHAR(200) NOT NULL,
    "charity_number" VARCHAR(30),
    "contact_name" VARCHAR(120) NOT NULL,
    "contact_email" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(30),
    "website" VARCHAR(300),
    "description" TEXT NOT NULL,
    "status" VARCHAR(24) NOT NULL DEFAULT 'applied',
    "needs_logo" BOOLEAN NOT NULL DEFAULT true,
    "needs_colours" BOOLEAN NOT NULL DEFAULT true,
    "needs_website" BOOLEAN NOT NULL DEFAULT true,
    "needs_donations" BOOLEAN NOT NULL DEFAULT true,
    "needs_payments" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charity_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charity_tasks" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "task_key" VARCHAR(32) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'upcoming',
    "completed_at" TIMESTAMP(3),
    "estimated_date" TIMESTAMP(3),
    "deliverables" TEXT[],
    "assigned_to" VARCHAR(120),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charity_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT,
    "category" VARCHAR(64) NOT NULL,
    "author_name" VARCHAR(120) NOT NULL,
    "author_avatar" VARCHAR(64) NOT NULL,
    "read_time" VARCHAR(16) NOT NULL,
    "cover_gradient" VARCHAR(255) NOT NULL,
    "cover_icon" VARCHAR(16) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders"("stripe_session_id");

-- CreateIndex
CREATE INDEX "orders_customer_email_idx" ON "orders"("customer_email");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_order_id_key" ON "transactions"("order_id");

-- CreateIndex
CREATE INDEX "transactions_id_order_id_idx" ON "transactions"("id", "order_id");

-- CreateIndex
CREATE INDEX "consultancy_stages_transaction_id_idx" ON "consultancy_stages"("transaction_id");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- CreateIndex
CREATE INDEX "charity_projects_status_idx" ON "charity_projects"("status");

-- CreateIndex
CREATE INDEX "charity_projects_contact_email_idx" ON "charity_projects"("contact_email");

-- CreateIndex
CREATE INDEX "charity_tasks_project_id_idx" ON "charity_tasks"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultancy_stages" ADD CONSTRAINT "consultancy_stages_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charity_tasks" ADD CONSTRAINT "charity_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "charity_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
