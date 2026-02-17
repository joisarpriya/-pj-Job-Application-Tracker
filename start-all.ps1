# Start backend and frontend in separate PowerShell windows for Windows users
# Usage: right-click -> Run with PowerShell OR from terminal: .\start-all.ps1

# Start backend (nodemon must be installed in backend node_modules)
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\backend; npm run dev" -WindowStyle Normal

# Start frontend (Vite)
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot; npm run dev" -WindowStyle Normal

Write-Output "Launched backend and frontend. Check their windows for logs."