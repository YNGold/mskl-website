const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const dbPath = path.join(__dirname, '../prisma/dev.db')
const backupDir = path.join(__dirname, '../backups')

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupPath = path.join(backupDir, `mskl-backup-${timestamp}.db`)

// Copy database file
fs.copyFileSync(dbPath, backupPath)

console.log(`✅ Database backed up to: ${backupPath}`)

// Keep only last 10 backups
const backups = fs.readdirSync(backupDir)
  .filter(file => file.startsWith('mskl-backup-'))
  .sort()
  .reverse()

if (backups.length > 10) {
  const toDelete = backups.slice(10)
  toDelete.forEach(file => {
    fs.unlinkSync(path.join(backupDir, file))
    console.log(`🗑️  Deleted old backup: ${file}`)
  })
}

console.log(`📊 Total backups: ${backups.length}`) 