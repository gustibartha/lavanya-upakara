const Database = require('better-sqlite3');
const db = new Database('lavanya.db');

function addColumn(table, column, type) {
  try {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`).run();
    console.log(`Added ${column} to ${table} table`);
  } catch (e) {
    if (e.message.includes("duplicate column name")) {
      console.log(`${column} already exists in ${table} table`);
    } else {
      console.error(`Error adding ${column} to ${table}:`, e.message);
    }
  }
}

// User table
addColumn('user', 'phone_number', 'TEXT');

// Orders table
addColumn('orders', 'jalan', 'TEXT');
addColumn('orders', 'kelurahan', 'TEXT');
addColumn('orders', 'kecamatan', 'TEXT');
addColumn('orders', 'kota', 'TEXT');
addColumn('orders', 'provinsi', 'TEXT');
addColumn('orders', 'kodepos', 'TEXT');
addColumn('orders', 'shipping_method', 'TEXT');
addColumn('orders', 'shipping_service', 'TEXT');

db.close();
