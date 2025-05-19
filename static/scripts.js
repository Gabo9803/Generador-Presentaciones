document.getElementById('presentationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = document.getElementById('topic')?.value;
    const num_slides = document.getElementById('num_slides')?.value;
    const tone = document.getElementById('tone')?.value;
    const audience = document.getElementById('audience')?.value;
    const language = document.getElementById('language')?.value;
    const presentation_type = document.getElementById('presentation_type')?.value;
    const theme = document.getElementById('theme')?.value;
    const context = document.getElementById('context')?.value;
    const loader = document.getElementById('loader');
    const slidesContainer = document.getElementById('slidesContainer');
    const slidesDiv = document.getElementById('slides');
    const thumbnailsDiv = document.getElementById('thumbnails');
    const questionsDiv = document.getElementById('questions');
    const quoteDiv = document.getElementById('quote');
    const feedback = document.getElementById('feedback');

    if (!loader || !slidesContainer || !slidesDiv || !thumbnailsDiv || !questionsDiv || !quoteDiv || !feedback) {
        console.error('Uno o más elementos del DOM no se encontraron.');
        return;
    }

    loader.classList.remove('hidden');
    slidesContainer.classList.add('hidden');
    slidesDiv.innerHTML = '';
    thumbnailsDiv.innerHTML = '';
    questionsDiv.innerHTML = '';
    quoteDiv.innerHTML = '';
    feedback.classList.add('hidden');

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, num_slides: parseInt(num_slides), tone, audience, language, presentation_type, theme, context })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Aplicar estilos del tema
        slidesContainer.style.backgroundColor = data.theme_styles?.background || '#ffffff';
        slidesContainer.style.color = data.theme_styles?.text_color || '#000000';
        slidesContainer.style.fontFamily = data.theme_styles?.font || 'Arial';

        if (!Array.isArray(data.slides)) {
            throw new Error("La respuesta no contiene diapositivas válidas.");
        }

        const escapeHTML = (str) => {
            if (typeof str !== 'string') return '';
            return str.replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;');
        };

        data.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slide');
            if (index === 0) slideDiv.classList.add('active');
            slideDiv.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">${escapeHTML(slide.title)}</h2>
                <p>${escapeHTML(slide.content)}</p>
                <p class="mt-2 text-sm italic">Notas del orador: ${escapeHTML(slide.speaker_notes)}</p>
                ${slide.image_url ? `<img src="${escapeHTML(slide.image_url)}" alt="${escapeHTML(slide.image_description || 'Imagen de la diapositiva')}" class="mt-4 w-full h-48 object-cover rounded-lg">` : ''}
            `;
            slidesDiv.appendChild(slideDiv);

            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('thumbnail');
            thumbnailDiv.innerHTML = `<p class="text-sm">${escapeHTML(slide.title)}</p>`;
            thumbnailDiv.addEventListener('click', () => {
                document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
                slideDiv.classList.add('active');
                currentSlide = index;
            });
            thumbnailsDiv.appendChild(thumbnailDiv);
        });

        if (data.audience_questions && Array.isArray(data.audience_questions)) {
            questionsDiv.innerHTML = `
                <h3 class="text-xl font-bold mb-2">Preguntas para la Audiencia</h3>
                <ul class="list-disc pl-5">
                    ${data.audience_questions.map(q => `<li>${escapeHTML(q)}</li>`).join('')}
                </ul>
            `;
        }

        if (data.quote) {
            quoteDiv.innerHTML = `Cita: "${escapeHTML(data.quote)}"`;
        }

        feedback.classList.remove('hidden');
        feedback.classList.remove('text-red-500');
        feedback.classList.add('text-green-600');
        feedback.textContent = '¡Presentación generada con éxito!';
        loader.classList.add('hidden');
        slidesContainer.classList.remove('hidden');

        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const prevSlideBtn = document.getElementById('prevSlide');
        const nextSlideBtn = document.getElementById('nextSlide');
        const fullscreenBtn = document.getElementById('fullscreen');

        if (prevSlideBtn) {
            prevSlideBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    slides[currentSlide].classList.remove('active');
                    currentSlide--;
                    slides[currentSlide].classList.add('active');
                }
            });
        }

        if (nextSlideBtn) {
            nextSlideBtn.addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    slides[currentSlide].classList.remove('active');
                    currentSlide++;
                    slides[currentSlide].classList.add('active');
                }
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                slidesContainer.classList.toggle('fullscreen');
                if (slidesContainer.classList.contains('fullscreen')) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                    fullscreenBtn.setAttribute('aria-label', 'Salir de pantalla completa');
                } else {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    fullscreenBtn.setAttribute('aria-label', 'Pantalla completa');
                }
            });
        }

        const exportPdfBtn = document.getElementById('exportPdf');
        const exportPptxBtn = document.getElementById('exportPptx');
        const exportJsonBtn = document.getElementById('exportJson');

        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', async () => {
                await fetch('/export_pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).then(res => res.blob()).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'presentation.pdf';
                    a.click();
                });
            });
        }

        if (exportPptxBtn) {
            exportPptxBtn.addEventListener('click', async () => {
                await fetch('/export_pptx', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).then(res => res.blob()).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'presentation.pptx';
                    a.click();
                });
            });
        }

        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', async () => {
                await fetch('/export_json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).then(res => res.blob()).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'presentation.json';
                    a.click();
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
        loader.classList.add('hidden');
        slidesContainer.classList.remove('hidden');
        feedback.classList.remove('hidden');
        feedback.classList.remove('text-green-600');
        feedback.classList.add('text-red-500');
        feedback.textContent = `Error: ${escapeHTML(error.message)}`;
    }
});

const toggleTemplatesBtn = document.getElementById('toggleTemplates');
const templateSection = document.getElementById('templateSection');
if (toggleTemplatesBtn && templateSection) {
    toggleTemplatesBtn.addEventListener('click', () => {
        const isExpanded = templateSection.classList.toggle('hidden');
        toggleTemplatesBtn.setAttribute('aria-expanded', !isExpanded);
        const chevron = toggleTemplatesBtn.querySelector('i');
        chevron.classList.toggle('fa-chevron-down', isExpanded);
        chevron.classList.toggle('fa-chevron-up', !isExpanded);
    });
}

const templateForm = document.getElementById('templateForm');
if (templateForm) {
    templateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('templateName')?.value;
        const content = document.getElementById('templateContent')?.value;
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.classList.remove('hidden');
            feedback.classList.remove('text-red-500');
            feedback.classList.add('text-green-600');
            feedback.textContent = 'Guardando plantilla...';
        }
        await fetch('/save_template', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content })
        }).then(res => res.json()).then(data => {
            if (data.error) throw new Error(data.error);
            if (feedback) {
                feedback.textContent = '¡Plantilla guardada con éxito!';
                setTimeout(() => {
                    feedback.classList.add('hidden');
                    location.reload();
                }, 2000);
            }
        }).catch(error => {
            if (feedback) {
                feedback.classList.remove('text-green-600');
                feedback.classList.add('text-red-500');
                feedback.textContent = `Error: ${escapeHTML(error.message)}`;
            }
        });
    });
}

const templateSelect = document.getElementById('templateSelect');
if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
        const context = document.getElementById('context');
        if (context) context.value = e.target.value;
    });
}