document.addEventListener('DOMContentLoaded', () => {
    const mermaidCodeInput = document.getElementById('mermaid-code');
    const renderButton = document.getElementById('render-button');
    const mermaidPreview = document.getElementById('mermaid-preview');
    const errorMessageArea = document.getElementById('error-message-area');

    const themeSelector = document.getElementById('theme-selector');
    const fontSelector = document.getElementById('font-selector');
    const pngSizeSelector = document.getElementById('png-size-selector');
    const exportPngButton = document.getElementById('export-png-button');
    const exportSvgButton = document.getElementById('export-svg-button');

    let debounceTimer;

    // --- FONT CONSTANTS ---
    const FONT_LXGW = '"LXGW WenKai", "霞鹜文楷", "Source Han Sans SC", "思源黑体 CN", sans-serif';
    const FONT_SOURCE_HAN_SANS = '"Source Han Sans SC", "思源黑体 CN", "Roboto", "Inter", sans-serif';
    const FONT_YAHEI = '"Microsoft YaHei", "微软雅黑", "Segoe UI", sans-serif';
    const FONT_ROBOTO_INTER_SANS = '"Roboto", "Inter", "Helvetica Neue", "Arial", "Noto Sans", sans-serif';
    const FONT_SOURCE_HAN_SERIF = '"Source Han Serif SC", "思源宋体 CN", "Georgia", serif';
    const FONT_GEOMETRIC_SANS = '"Futura", "Avenir", "Century Gothic", sans-serif';
    const FONT_DECO_GEOMETRIC = '"Bebas Neue", "Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif';
    const FONT_VINTAGE_SERIF = '"Baskerville Old Face", "Garamond", "Times New Roman", serif';
    const FONT_MONOSPACE_TECH = '"Space Mono", "Fira Code", "Courier New", monospace';
    const FONT_SONGTI = '"SimSun", "宋体", serif';
    const FONT_FANGSONG = '"FangSong", "仿宋", serif';
    const FONT_KAITI = '"KaiTi", "楷体", "STKaiti", serif';
    const FONT_HEITI = '"SimHei", "黑体", sans-serif';

    // --- GANTT_VARS_DEFAULT ---
    const GANTT_VARS_DEFAULT = {
        ganttDbACompleted: '#A0AEC0',
        ganttDbAActive: '#63B3ED',   
        ganttDbADone: '#E2E8F0',     
        ganttDbACrit: '#FC8181',     
        ganttDbAMilestone: '#A78BFA',
        ganttTitleColor: '#2D3748',  
        ganttGridColor: '#E2E8F0',   
        ganttTodayMarkerStroke: '#F59E0B',
        ganttBarHeight: 20,
        ganttTaskHeight: 20,
        ganttPadding: 6,
        ganttFontSize: 12,
        ganttSectionFontSize: 14,
        ganttAxisFormat: '%Y-%m-%d',
    };

    // --- CUSTOM THEMES (V4 - Final Integration, focusing on achievable styles) ---
    const customThemes = {
        // ====== 官方主题 (保留) ======
        mermaidDefault: { name: "Default (官方默认)", theme: 'default', themeVariables: { fontFamily: FONT_ROBOTO_INTER_SANS, ...GANTT_VARS_DEFAULT } },
        mermaidNeutral: { name: "Neutral (官方中性)", theme: 'neutral', themeVariables: { fontFamily: FONT_ROBOTO_INTER_SANS, ...GANTT_VARS_DEFAULT } },
        mermaidDark: {
            name: "Dark (官方暗色)", theme: 'dark', 
            themeVariables: { 
                fontFamily: FONT_ROBOTO_INTER_SANS, background: '#333333', 
                primaryColor: '#505050', primaryTextColor: '#f0f0f0', 
                lineColor: '#888888', textColor: '#f0f0f0', 
                ...GANTT_VARS_DEFAULT, 
                ganttTitleColor: '#E0E0E0', ganttGridColor: '#4A5568',
                ganttDbACompleted: '#718096', ganttDbAActive: '#A0AEC0', ganttDbACrit: '#E53E3E', ganttDbAMilestone: '#9F7AEA',
            }
        },
        mermaidForest: { name: "Forest (官方森林)", theme: 'forest', themeVariables: { fontFamily: FONT_ROBOTO_INTER_SANS, ...GANTT_VARS_DEFAULT } },

        // ====== V4 精致化自定义主题 ======
        // --- 亮色系 ---
        contrastModernLight: { 
            name: "Modern Contrast Light (现代对比亮)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS,
                background: '#FFFFFF',
                primaryColor: '#F7FAFC',      
                primaryTextColor: '#1A202C',   
                primaryBorderColor: '#2563EB', 
                lineColor: '#CBD5E1',          
                textColor: '#2D3748',         
                fontSize: '15px',              
                pie1: '#2563EB', pie2: '#16A34A', pie3: '#EA580C', pie4: '#DC2626', pie5: '#7C3AED',
                ...GANTT_VARS_DEFAULT, 
                ganttTitleColor: '#1A202C',
                ganttSectionFontSize: 15, 
                ganttBarHeight: 20,
                ganttGridColor: '#E2E8F0',
                ganttDbAMilestone: '#7C3AED', 
            }
        },
        minimalistLightRefined: { 
            name: "Minimalist Light (精致极简亮)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_LXGW, background: '#FDFDFD', 
                primaryColor: '#FFFFFF', primaryTextColor: '#2D3748', 
                primaryBorderColor: '#E2E8F0', lineColor: '#A0AEC0', textColor: '#4A5568',         
                fontSize: '14px', 
                pie1: '#4299E1', pie2: '#48BB78', pie3: '#ED8936', pie4: '#F56565', pie5: '#ECC94B',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#2D3748', ganttGridColor: '#E2E8F0',
                ganttDbACompleted: '#A0AEC0', ganttDbAActive: '#E6FFFA', ganttDbACrit: '#FED7D7', 
            }
        },
        appleInspiredLight: { 
            name: "Apple Inspired Light (苹果风亮)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS, background: '#FFFFFF', 
                primaryColor: '#F5F5F7', primaryTextColor: '#1D1D1F', 
                primaryBorderColor: '#C6C6C8', lineColor: '#D1D1D6', textColor: '#333333', 
                fontSize: '14px',
                pie1: '#0A84FF', pie2: '#30D158', pie3: '#FF9F0A', pie4: '#FF375F', pie5: '#AF52DE',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#1D1D1F'
            }
        },
        paperAndInk: { 
            name: "Paper & Ink (纸墨书香)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_SOURCE_HAN_SERIF, background: '#FDFCFB',
                primaryColor: '#F7F5F2', primaryTextColor: '#2F2C2A',
                primaryBorderColor: '#B0A8A1', lineColor: '#D3CCC7',
                textColor: '#423B35', fontSize: '14px',
                pie1: '#594F48', pie2: '#8C7D70', pie3: '#A99985', pie4: '#C6B89E', pie5: '#E0D6CC',
                ...GANTT_VARS_DEFAULT, ganttBarHeight: 16, ganttTitleColor: '#2F2C2A'
            }
        },
        mujiInspired: { 
            name: "Muji Inspired (无印良品风)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_LXGW, background: '#F5F5F1',
                primaryColor: '#FFFFFF', primaryTextColor: '#333333',
                primaryBorderColor: '#B0A090', lineColor: '#A0A0A0',
                textColor: '#4A4A4A', fontSize: '13px',
                pie1: '#8B7D72', pie2: '#A19387', pie3: '#B0A090', pie4: '#C0B0A0', pie5: '#D4C8BE',
                ...GANTT_VARS_DEFAULT, ganttFontSize: 10, ganttSectionFontSize: 12, ganttTitleColor: '#3A3A3A'
            }
        },
        
        // --- 深色系 ---
        contrastDarkPro: { 
            name: "Modern Contrast Dark (现代对比暗)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS,
                background: '#111827',          
                primaryColor: '#1F2937',        
                primaryTextColor: '#F9FAFB',    
                primaryBorderColor: '#3B82F6',  
                lineColor: '#4B5563',           
                textColor: '#E5E7EB',          
                fontSize: '15px',               
                pie1: '#3B82F6', pie2: '#10B981', pie3: '#F59E0B', pie4: '#EF4444', pie5: '#8B5CF6',
                ...GANTT_VARS_DEFAULT,
                ganttTitleColor: '#F9FAFB',
                ganttSectionFontSize: 15,
                ganttBarHeight: 20,
                ganttGridColor: '#374151', 
                ganttDbACompleted: '#4B5563', ganttDbAActive: '#60A5FA', ganttDbACrit: '#F87171', ganttDbAMilestone: '#A78BFA',
            }
        },
        minimalistDarkRefined: { 
            name: "Minimalist Dark (精致极简暗)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_LXGW, background: '#1A202C', 
                primaryColor: '#2D3748', primaryTextColor: '#E2E8F0', 
                primaryBorderColor: '#4A5568', lineColor: '#718096', textColor: '#A0AEC0',         
                fontSize: '14px',
                pie1: '#63B3ED', pie2: '#68D391', pie3: '#F6AD55', pie4: '#FC8181', pie5: '#F6E05E',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#E2E8F0', ganttGridColor: '#2D3748'
            }
        },
        cyberpunkNeonVoltage: { 
            name: "Cyberpunk Neon (霓虹电压)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_MONOSPACE_TECH, background: '#0D0221', 
                primaryColor: '#1A0A3B', primaryTextColor: '#9EF0F0', 
                primaryBorderColor: '#F92A82', lineColor: '#FF00FF', textColor: '#C0CAF5', 
                fontSize: '14px',
                pie1: '#F92A82', pie2: '#00F0B5', pie3: '#7DF9FF', pie4: '#F4D35E', pie5: '#FF47DA',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#9EF0F0', ganttGridColor: '#3B3E51',
                ganttDbACompleted: '#F92A82', ganttDbAActive: '#00F0B5', ganttFontSize: 11
            }
        },
        modernGraphite: { 
            name: "Modern Graphite (现代石墨)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS, background: '#343A40',
                primaryColor: '#495057', primaryTextColor: '#F8F9FA',
                lineColor: '#6C757D', primaryBorderColor: '#ADB5BD',
                textColor: '#CED4DA', fontSize: '14px',
                pie1: '#6C757D', pie2: '#ADB5BD', pie3: '#CED4DA', pie4: '#DEE2E6', pie5: '#F8F9FA',
                ...GANTT_VARS_DEFAULT, ganttFontSize: 10, ganttTitleColor: '#F8F9FA', ganttGridColor: '#495057',
                ganttDbACompleted: '#6C757D', ganttDbAActive: '#ADB5BD', ganttDbACrit: '#DEE2E6', ganttDbAMilestone: '#F8F9FA',
            }
        },

        // --- 专业/企业风格 ---
        professionalBluePrint: { 
            name: "Professional Blueprint (专业蓝图)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS, background: '#1A237E', 
                primaryColor: '#283593', primaryTextColor: '#E3F2FD', 
                primaryBorderColor: '#5C6BC0', lineColor: '#90CAF9', textColor: '#BBDEFB',       
                fontSize: '13px',
                pie1: '#42A5F5', pie2: '#90CAF9', pie3: '#E3F2FD', pie4: '#1E88E5', pie5: '#64B5F6',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#E3F2FD', ganttAxisFormat: '%m/%d',
                ganttGridColor: '#3949AB', ganttTodayMarkerStroke: '#FFCA28',
                ganttBarHeight: 18, ganttTaskHeight: 18, ganttSectionFontSize: 13, // ganttTaskFontSize: 11, // Removed as not a standard mermaid var
            }
        },
        mcKinseyBlueFocus: { 
            name: "McKinsey Blue Focus (麦肯锡蓝)", 
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_SOURCE_HAN_SANS, background: '#FFFFFF',
                primaryColor: '#F0F5FA', primaryTextColor: '#051C2C',
                primaryBorderColor: '#0057D2', lineColor: '#A9B4BE',
                textColor: '#223548', fontSize: '14px',
                pie1: '#0057D2', pie2: '#4DB1FF', pie3: '#00B7C3', pie4: '#5A6872', pie5: '#A9B4BE',
                ...GANTT_VARS_DEFAULT, ganttFontSize: 11, ganttSectionFontSize: 13, ganttTitleColor: '#051C2C'
            }
        },
        googleMaterial: { 
            name: "Material Design (谷歌质感)", 
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_ROBOTO_INTER_SANS, background: '#FFFFFF',
                primaryColor: '#E3F2FD', primaryTextColor: '#0D47A1',
                primaryBorderColor: '#1976D2', lineColor: '#90CAF9',
                textColor: '#212121', fontSize: '14px',
                pie1: '#2196F3', pie2: '#4CAF50', pie3: '#FFC107', pie4: '#F44336', pie5: '#673AB7',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#0D47A1'
            }
        },
        academicStandard: { 
            name: "Academic Standard (学术规范)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_SOURCE_HAN_SERIF, background: '#F8F8F8',
                primaryColor: '#EAEAEA', primaryTextColor: '#303030',
                lineColor: '#C0C0C0', primaryBorderColor: '#A0A0A0',
                textColor: '#303030', fontSize: '14px',
                pie1: '#4A6B82', pie2: '#7FA2BF', pie3: '#B3C9DD', pie4: '#5E81AC', pie5: '#87A7C0',
                ...GANTT_VARS_DEFAULT, ganttTitleColor: '#303030'
            }
        },
        
        // --- 特色/艺术风格 ---
        creativeVitality: { 
            name: "Creative Vitality (创意活力)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_GEOMETRIC_SANS,
                background: '#FFFBEB',          
                primaryColor: '#FEF3C7',        
                primaryTextColor: '#92400E',    
                primaryBorderColor: '#F59E0B',  
                lineColor: '#FCD34D',           
                textColor: '#78350F',          
                fontSize: '15px',
                pie1: '#F59E0B', pie2: '#6366F1', pie3: '#D97706', pie4: '#4F46E5', pie5: '#FBBF24',
                ...GANTT_VARS_DEFAULT,
                ganttTitleColor: '#92400E',
                ganttSectionFontSize: 16,
                ganttBarHeight: 22, 
                ganttGridColor: '#FDE68A',
                // ganttTaskFontSize: 13, // Removed as not a standard mermaid var
            }
        },
        bauhausInspired: { 
            name: "Bauhaus Inspired (包豪斯)",
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_GEOMETRIC_SANS, background: '#F0EFEB', 
                primaryColor: '#FFFFFF', primaryTextColor: '#000000',
                primaryBorderColor: '#000000', lineColor: '#000000',
                textColor: '#000000', fontSize: '14px',
                pie1: '#DE1A1A', pie2: '#FFDD00', pie3: '#0057A8', pie4: '#333333', pie5: '#F0EFEB', 
                ...GANTT_VARS_DEFAULT, ganttAxisFormat: '%Y/%m/%d',
                ganttFontSize: 11, ganttSectionFontSize: 13, ganttTitleColor: '#000000'
            }
        },
        xmOceanicBlue: { 
            name: "XM-Oceanic Blue (海洋蓝)", 
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_SOURCE_HAN_SANS, background: '#E6F3F7',
                primaryColor: '#B3D9E6', primaryTextColor: '#004C6D',
                primaryBorderColor: '#3D8DA9', lineColor: '#60A5C0',
                textColor: '#003B54', fontSize: '14px',
                pie1: '#0077A2', pie2: '#3D8DA9', pie3: '#60A5C0', pie4: '#87BED1', pie5: '#ADD8E6',
                ...GANTT_VARS_DEFAULT, ganttBarHeight: 18, ganttTitleColor: '#004C6D'
            }
        },
        xmForestPath: { 
            name: "XM-Forest Path (森林绿)", 
            theme: 'base',
            themeVariables: {
                fontFamily: FONT_LXGW, background: '#F2F5F0',
                primaryColor: '#DDE5D9', primaryTextColor: '#2A402D',
                primaryBorderColor: '#677F6B', lineColor: '#8BA082',
                textColor: '#1E3021', fontSize: '14px',
                pie1: '#4CAF50', pie2: '#66BB6A', pie3: '#81C784', pie4: '#A5D6A7', pie5: '#C8E6C9',
                ...GANTT_VARS_DEFAULT, ganttBarHeight: 18, ganttTitleColor: '#2A402D'
            }
        },
    };
    
    // --- AVAILABLE FONTS ---
    const availableFonts = [
        { name: "默认 (跟随主题)", value: "theme-default" },
        { name: "微软雅黑", value: FONT_YAHEI },
        { name: "思源黑体 (Source Han Sans)", value: FONT_SOURCE_HAN_SANS },
        { name: "思源宋体 (Source Han Serif)", value: FONT_SOURCE_HAN_SERIF },
        { name: "霞鹜文楷 (LXGW WenKai)", value: FONT_LXGW },
        { name: "宋体 (SimSun)", value: FONT_SONGTI },
        { name: "仿宋 (FangSong)", value: FONT_FANGSONG },
        { name: "楷体 (KaiTi)", value: FONT_KAITI },
        { name: "黑体 (SimHei)", value: FONT_HEITI },
        { name: "Roboto/Inter (现代无衬线)", value: FONT_ROBOTO_INTER_SANS },
        { name: "等宽编程字体", value: FONT_MONOSPACE_TECH },
        { name: "几何无衬线", value: FONT_GEOMETRIC_SANS },
        { name: "装饰无衬线", value: FONT_DECO_GEOMETRIC },
        { name: "复古衬线", value: FONT_VINTAGE_SERIF },
    ];
    
    let currentMermaidThemeKey = 'mermaidDefault';
    let currentMermaidFontStack = 'theme-default';

    function populateDropdown(selector, items, valueField, nameField) {
        selector.innerHTML = ''; 
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[nameField];
            selector.appendChild(option);
        });
    }

    function populateThemeDropdown() {
        themeSelector.innerHTML = ''; 
        for (const themeKey in customThemes) {
            const option = document.createElement('option');
            option.value = themeKey;
            option.textContent = customThemes[themeKey].name;
            themeSelector.appendChild(option);
        }
    }
    
    function applyThemeAndFont() {
        currentMermaidThemeKey = themeSelector.value || 'mermaidDefault';
        currentMermaidFontStack = fontSelector.value || 'theme-default';

        const themeObj = customThemes[currentMermaidThemeKey] || customThemes['mermaidDefault'];
        
        let effectiveFontFamily = currentMermaidFontStack;
        if (currentMermaidFontStack === 'theme-default') {
            effectiveFontFamily = themeObj.themeVariables?.fontFamily || FONT_ROBOTO_INTER_SANS; // Use a sensible default
        }

        const mermaidConfig = {
            startOnLoad: false, 
            securityLevel: 'loose',
            theme: themeObj.theme,
            fontFamily: effectiveFontFamily, // Global font for mermaid
        };

        if (themeObj.themeVariables) {
            // Ensure fontFamily is consistently applied, especially for 'base' themes
            mermaidConfig.themeVariables = { ...themeObj.themeVariables, fontFamily: effectiveFontFamily };
        } else if (themeObj.theme === 'base') { // Base theme must have themeVariables
             mermaidConfig.themeVariables = { fontFamily: effectiveFontFamily };
        }


        mermaid.initialize(mermaidConfig);
        renderMermaid();
    }

    mermaid.initialize({ 
        startOnLoad: false,
        securityLevel: 'loose'
    });

    async function renderMermaid() {
        const code = mermaidCodeInput.value.trim();
        hideError(); 

        if (!code) {
            mermaidPreview.innerHTML = '<p style="text-align:center; color:#888;">在此处输入 Mermaid 代码并点击 "生成预览"，或直接在输入框中修改内容，预览会自动更新。</p>';
            return;
        }
        try {
            // Ensure a unique ID for each render to force re-evaluation with new themes/code
            const renderId = 'mermaid-graph-render-' + Date.now();
            // The div for rendering should not exist yet, mermaid.render creates it or uses the provided one
            mermaidPreview.innerHTML = `<div id="${renderId}"></div>`; // Clear previous and prepare container
            const { svg, bindFunctions } = await mermaid.render(renderId, code);
            mermaidPreview.innerHTML = svg; // Replace container div with actual SVG
            if (bindFunctions) {
                bindFunctions(mermaidPreview); // This should bind to the new SVG element
            }
        } catch (error) {
            console.error('Mermaid rendering error:', error);
            const errorMessage = error.message || error.str || (typeof error === 'string' ? error : '未知渲染错误');
            showError(`Mermaid 代码渲染失败：\n${errorMessage}`);
            // Clear preview on error to avoid showing stale or broken SVG
            mermaidPreview.innerHTML = `<p style="text-align:center; color:red;">渲染错误，请检查代码或控制台。</p>`;
        }
    }

    function showError(message) {
        errorMessageArea.textContent = message;
        errorMessageArea.classList.add('visible');
    }

    function hideError() {
        errorMessageArea.textContent = '';
        errorMessageArea.classList.remove('visible');
    }

    renderButton.addEventListener('click', renderMermaid);

    mermaidCodeInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderMermaid, 1500);
    });

    themeSelector.addEventListener('change', applyThemeAndFont);
    fontSelector.addEventListener('change', applyThemeAndFont);

    function getCurrentThemeBackgroundColor() {
        const themeObj = customThemes[currentMermaidThemeKey] || customThemes['mermaidDefault'];
        if (themeObj.theme === 'dark' && !themeObj.themeVariables?.background) {
            return '#333333';
        }
        return themeObj.themeVariables?.background || '#ffffff';
    }
    
    // --- MODIFIED SVG EXPORT (with background and scaling) ---
    exportSvgButton.addEventListener('click', () => {
        const svgElement = mermaidPreview.querySelector('svg');
        if (!svgElement) {
            alert('没有可导出的图形。请先生成预览。');
            return;
        }

        const svgClone = svgElement.cloneNode(true);
        if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        const themeBg = getCurrentThemeBackgroundColor();
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', '100%'); 
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', themeBg);
        svgClone.insertBefore(rect, svgClone.firstChild);

        let originalWidth, originalHeight;
        const viewBox = svgClone.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/[\s,]+/);
            originalWidth = parseFloat(parts[2]);
            originalHeight = parseFloat(parts[3]);
        } else {
            originalWidth = parseFloat(svgClone.getAttribute('width'));
            originalHeight = parseFloat(svgClone.getAttribute('height'));
        }
        
        if (isNaN(originalWidth) || originalWidth <= 0 || isNaN(originalHeight) || originalHeight <= 0) {
            const bounds = svgElement.getBoundingClientRect();
            originalWidth = bounds.width;
            originalHeight = bounds.height;
        }


        if (isNaN(originalWidth) || originalWidth <= 0 || isNaN(originalHeight) || originalHeight <= 0) {
            alert('无法确定SVG原始尺寸，SVG将按原样导出。');
            // Proceed without scaling if dimensions are unknown
        } else {
            const selectedMultiplier = parseFloat(pngSizeSelector.value) || 1;
            const targetBaseHeight = 1080;

            const scaleToReachBaseHeight = targetBaseHeight / originalHeight;
            const finalScaleFactor = scaleToReachBaseHeight * selectedMultiplier;

            const scaledWidth = originalWidth * finalScaleFactor;
            const scaledHeight = originalHeight * finalScaleFactor;

            svgClone.setAttribute('width', scaledWidth.toFixed(2));
            svgClone.setAttribute('height', scaledHeight.toFixed(2));
        }
        
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        let downloadFileName = 'mermaid-graph';
        const selectedMultiplierForName = parseFloat(pngSizeSelector.value) || 1;
        if (selectedMultiplierForName === 1) {
            downloadFileName += '-1080p.svg';
        } else {
            downloadFileName += `-${selectedMultiplierForName}x1080p.svg`;
        }
        a.download = downloadFileName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // --- MODIFIED PNG EXPORT ---
    exportPngButton.addEventListener('click', () => {
        const svgElement = mermaidPreview.querySelector('svg');
        if (!svgElement) {
            alert('没有可导出的图形。请先生成预览。');
            return;
        }

        let originalWidth, originalHeight;
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/[\s,]+/);
            originalWidth = parseFloat(parts[2]);
            originalHeight = parseFloat(parts[3]);
        } else {
            originalWidth = parseFloat(svgElement.getAttribute('width'));
            originalHeight = parseFloat(svgElement.getAttribute('height'));
        }

        if (isNaN(originalWidth) || originalWidth <= 0 || isNaN(originalHeight) || originalHeight <= 0) {
            const rect = svgElement.getBoundingClientRect();
            originalWidth = rect.width;
            originalHeight = rect.height;
        }

        if (isNaN(originalWidth) || originalWidth <= 0 || isNaN(originalHeight) || originalHeight <= 0) {
            showError("无法确定SVG原始尺寸，导出PNG失败。SVG内容可能为空或无效，或未正确渲染。");
            alert("无法确定SVG原始尺寸，导出PNG失败。");
            return;
        }

        const svgCloneForExport = svgElement.cloneNode(true);
        if (!svgCloneForExport.getAttribute('xmlns')) {
            svgCloneForExport.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svgCloneForExport.setAttribute('width', originalWidth.toString());
        svgCloneForExport.setAttribute('height', originalHeight.toString());

        const themeBg = getCurrentThemeBackgroundColor();
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgRect.setAttribute('x', '0'); bgRect.setAttribute('y', '0');
        bgRect.setAttribute('width', '100%');
        bgRect.setAttribute('height', '100%');
        bgRect.setAttribute('fill', themeBg);
        svgCloneForExport.insertBefore(bgRect, svgCloneForExport.firstChild);
        
        const svgData = new XMLSerializer().serializeToString(svgCloneForExport);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const imgNaturalWidth = img.naturalWidth || originalWidth;
            const imgNaturalHeight = img.naturalHeight || originalHeight;

            if (imgNaturalWidth === 0 || imgNaturalHeight === 0) {
                showError("SVG加载到Image对象后尺寸为0。导出PNG失败。");
                alert("SVG加载到Image对象后尺寸为0。导出PNG失败。");
                URL.revokeObjectURL(img.src);
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const selectedMultiplier = parseFloat(pngSizeSelector.value) || 1;
            const targetBaseHeight = 1080;

            const scaleToReachBaseHeight = targetBaseHeight / imgNaturalHeight;
            const finalScaleFactor = scaleToReachBaseHeight * selectedMultiplier;

            canvas.width = Math.round(imgNaturalWidth * finalScaleFactor);
            canvas.height = Math.round(imgNaturalHeight * finalScaleFactor);

            if (canvas.width <= 0 || canvas.height <= 0) {
                showError("计算出的目标图片尺寸无效。");
                alert("计算出的目标图片尺寸无效。");
                URL.revokeObjectURL(img.src);
                return;
            }
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(img.src);

            try {
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                let downloadFileName = 'mermaid-graph';
                if (selectedMultiplier === 1) {
                    downloadFileName += '-1080p.png';
                } else {
                    downloadFileName += `-${selectedMultiplier}x1080p.png`;
                }
                a.href = pngUrl;
                a.download = downloadFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                hideError(); 
            } catch (e) {
                console.error("Canvas toDataURL error for PNG:", e);
                showError(`导出 PNG 失败：\n${e.message}\n\n这通常发生在图表中包含的外部图片（例如，来自其他网站的图片）没有正确配置“跨域资源共享”(CORS)策略时。\n\n建议：\n1. 尝试使用允许跨域访问的图片链接。\n2. 如果可能，将图片下载后转为 Base64 编码（Data URI）嵌入到 Mermaid 代码中。\n3. 确保您使用的 Mermaid 代码中没有引用不可访问或有跨域限制的外部资源。`);
            }
        };

        img.onerror = (e) => {
            URL.revokeObjectURL(img.src);
            showError('将SVG加载到图片对象失败。无法导出PNG。\n这可能是由于SVG内包含的外部资源（如图片）无法访问或存在CORS问题，或SVG本身编码问题。\n请检查浏览器控制台(F12)获取更多信息。');
            console.error('Error loading SVG into Image object for PNG export:', e);
        };

        try {
            const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            img.src = dataUri;
        } catch (e) {
             showError('创建SVG Data URI失败。可能是SVG内容过大或包含无效字符。\n' + e.message);
             console.error('Error creating SVG Data URI:', e);
        }
    });

    // --- Initial Population & Setup ---
    populateThemeDropdown();
    populateDropdown(fontSelector, availableFonts, 'value', 'name');
    
    themeSelector.value = currentMermaidThemeKey;
    fontSelector.value = currentMermaidFontStack;
    
    applyThemeAndFont(); 
    
    if (!mermaidCodeInput.value.trim()) {
        mermaidPreview.innerHTML = '<p style="text-align:center; color:#888;">在此处输入 Mermaid 代码并点击 "生成预览"，或直接在输入框中修改内容，预览会自动更新。</p>';
        hideError();
    }
});