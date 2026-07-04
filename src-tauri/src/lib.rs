use tauri_plugin_sql::{Migration, MigrationKind};

// ── Migration guard ────────────────────────────────────────────────────────────
// When you add a new migrations/NNN_*.sql file you MUST also add it to the
// `migrations` vec below AND increment this constant, or the build will fail.
// That makes it impossible to silently forget the registration step.
const EXPECTED_MIGRATION_COUNT: usize = 16;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_seedlog_items",
            sql: include_str!("../migrations/001_create_seedlog_items.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_thread_overrides",
            sql: include_str!("../migrations/002_create_thread_overrides.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add_priority_fields",
            sql: include_str!("../migrations/003_add_priority_fields.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_project_meta",
            sql: include_str!("../migrations/004_create_project_meta.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_monthly_reflections",
            sql: include_str!("../migrations/005_create_monthly_reflections.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_daily_reviews",
            sql: include_str!("../migrations/006_create_daily_reviews.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "add_daily_planning_fields",
            sql: include_str!("../migrations/007_add_daily_planning_fields.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "add_daily_mental_debugs",
            sql: include_str!("../migrations/008_add_daily_mental_debugs.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add_item_manual_order",
            sql: include_str!("../migrations/009_add_item_manual_order.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "add_item_sub_items",
            sql: include_str!("../migrations/010_add_item_sub_items.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "create_projects",
            sql: include_str!("../migrations/011_create_projects.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "add_item_cultivation_fields",
            sql: include_str!("../migrations/012_add_item_cultivation_fields.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 13,
            description: "add_item_defer_fields",
            sql: include_str!("../migrations/013_add_item_defer_fields.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 14,
            description: "create_app_kv",
            sql: include_str!("../migrations/014_create_app_kv.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 15,
            description: "add_item_deleted_at",
            sql: include_str!("../migrations/015_add_item_deleted_at.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 16,
            description: "add_item_source_tag",
            sql: include_str!("../migrations/016_add_item_source_tag.sql"),
            kind: MigrationKind::Up,
        },
    ];

    // Compile-time check: if this panics at startup the count is wrong.
    assert!(
        migrations.len() == EXPECTED_MIGRATION_COUNT,
        "Migration count mismatch: expected {EXPECTED_MIGRATION_COUNT}, found {}. \
         Add the new migration to the vec above AND update EXPECTED_MIGRATION_COUNT.",
        migrations.len()
    );

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:seedlog.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running SeedLog");
}
