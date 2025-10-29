export function createPageUrl(pageName) {
  return `/${pageName}`;
}

export function showLumoAlert(title, message, type = "success") {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'lumo-alert-overlay';
  
  const bgGradient = type === "success" 
    ? "#66bfad, #1165b3" 
    : type === "error"
    ? "#ffa400, #ff8c00"
    : "#00d1ff, #66bfad";
  
  const emoji = type === "success" ? "✨" : type === "error" ? "💡" : "🌟";
  const borderColor = type === "success" ? "#66bfad" : type === "error" ? "#ffa400" : "#00d1ff";
  
  alertDiv.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-center; z-index: 9999; padding: 1rem;">
      <div style="background: linear-gradient(135deg, #e0f8f5 0%, #ffffff 100%); border-radius: 24px; padding: 2.5rem; max-width: 450px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.4); border: 4px solid ${borderColor}; animation: slideIn 0.3s ease-out;">
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 0.6s ease-in-out;">${emoji}</div>
          <div style="background: linear-gradient(135deg, ${bgGradient}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 1.75rem; font-weight: bold; margin-bottom: 0.75rem; font-family: system-ui, -apple-system, sans-serif;">${title}</div>
          <div style="color: #1165b3; font-size: 1.125rem; font-weight: 500; margin-bottom: 1.5rem; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif;">${message}</div>
          <button onclick="this.closest('.lumo-alert-overlay').remove()" style="background: linear-gradient(135deg, ${bgGradient}); color: white; border: none; padding: 0.875rem 2.5rem; border-radius: 16px; font-size: 1.125rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(102, 191, 173, 0.4); transition: transform 0.2s; font-family: system-ui, -apple-system, sans-serif;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Got it! 🎉</button>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    </style>
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

export function showLumoConfirm(title, message, onConfirm, onCancel) {
  const confirmDiv = document.createElement('div');
  confirmDiv.className = 'lumo-confirm-overlay';
  
  confirmDiv.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-center; z-index: 9999; padding: 1rem;">
      <div style="background: linear-gradient(135deg, #e0f8f5 0%, #ffffff 100%); border-radius: 24px; padding: 2.5rem; max-width: 450px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.4); border: 4px solid #66bfad; animation: slideIn 0.3s ease-out;">
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🤔</div>
          <div style="background: linear-gradient(135deg, #66bfad, #1165b3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 1.75rem; font-weight: bold; margin-bottom: 0.75rem; font-family: system-ui, -apple-system, sans-serif;">${title}</div>
          <div style="color: #1165b3; font-size: 1.125rem; font-weight: 500; margin-bottom: 1.5rem; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif;">${message}</div>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button id="lumo-cancel-btn" style="background: linear-gradient(135deg, #e0e0e0, #cccccc); color: #666; border: none; padding: 0.875rem 2rem; border-radius: 16px; font-size: 1.125rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; font-family: system-ui, -apple-system, sans-serif;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Not yet</button>
            <button id="lumo-confirm-btn" style="background: linear-gradient(135deg, #66bfad, #1165b3); color: white; border: none; padding: 0.875rem 2rem; border-radius: 16px; font-size: 1.125rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(102, 191, 173, 0.4); transition: transform 0.2s; font-family: system-ui, -apple-system, sans-serif;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Yes, let's do it! ✨</button>
          </div>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    </style>
  `;
  
  document.body.appendChild(confirmDiv);
  
  document.getElementById('lumo-confirm-btn').onclick = () => {
    confirmDiv.remove();
    if (onConfirm) onConfirm();
  };
  
  document.getElementById('lumo-cancel-btn').onclick = () => {
    confirmDiv.remove();
    if (onCancel) onCancel();
  };
}