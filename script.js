// Variáveis para armazenar os dados
        const checklistData = {
            fachada: null,
            padrao: null,
            instalacao: null,
            medidor: {
                foto: null,
                tipo: null
            },
            bussola: {
                foto: null,
                latitude: null,
                longitude: null
            },
            disjuntor: {
                foto: null,
                amperagem: null
            }
        };

        // Controle dos passos
        let currentStep = 1;
        const totalSteps = 6;

        function updateProgress() {
            const progressPercentage = (currentStep / totalSteps) * 100;
            document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
            document.getElementById('progress-indicator').textContent = `${currentStep}/${totalSteps}`;
            
            // Atualizar navegação do footer
            document.querySelectorAll('.step-nav').forEach((nav, index) => {
                if (index + 1 === currentStep) {
                    nav.classList.remove('text-gray-500');
                    nav.classList.add('text-blue-600');
                } else {
                    nav.classList.remove('text-blue-600');
                    nav.classList.add('text-gray-500');
                }
            });
        }

        function showStep(stepNumber) {
            document.querySelectorAll('.step').forEach(step => {
                step.classList.add('hidden');
                step.classList.remove('active');
            });
            
            document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
            document.getElementById(`step-${stepNumber}`).classList.add('active');
            
            currentStep = stepNumber;
            updateProgress();
        }

        function nextStep(current) {
            // Validar dados antes de avançar
            if (current === 1 && !checklistData.fachada) {
                alert('Por favor, tire ou selecione uma foto da fachada.');
                return;
            }
            
            if (current === 2 && !checklistData.padrao) {
                alert('Por favor, tire ou selecione uma foto do padrão.');
                return;
            }
            
            if (current === 3) {
                const instalacao = document.querySelector('input[name="instalacao"]:checked');
                if (!instalacao) {
                    alert('Por favor, selecione o tipo de instalação.');
                    return;
                }
                checklistData.instalacao = instalacao.value;
            }
            
            if (current === 4) {
                if (!checklistData.medidor.foto) {
                    alert('Por favor, tire ou selecione uma foto do medidor.');
                    return;
                }
                
                const tipoMedidor = document.querySelector('input[name="tipo_medidor"]:checked');
                if (!tipoMedidor) {
                    alert('Por favor, selecione o tipo do medidor.');
                    return;
                }
                checklistData.medidor.tipo = tipoMedidor.value;
            }
            
            if (current === 5) {
                if (!checklistData.bussola.foto) {
                    alert('Por favor, tire ou selecione uma foto da bússola.');
                    return;
                }
                
                const latitude = document.getElementById('latitude').value;
                const longitude = document.getElementById('longitude').value;
                
                if (!latitude || !longitude) {
                    alert('Por favor, preencha as coordenadas.');
                    return;
                }
                
                checklistData.bussola.latitude = latitude;
                checklistData.bussola.longitude = longitude;
            }
            
            showStep(current + 1);
        }

        function prevStep(current) {
            showStep(current - 1);
        }

        function goToStep(step) {
            showStep(step);
        }

        // Funções para manipulação de fotos (simuladas para demonstração)
        
        function handleFileInput(event, type) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById(`${type}-img`);
                    img.src = e.target.result;
                    document.getElementById(`${type}-placeholder`).classList.add('hidden');
                    document.getElementById(`${type}-preview`).classList.remove('hidden');

                    if (type === 'medidor' || type === 'bussola' || type === 'disjuntor') {
                        checklistData[type].foto = e.target.result;
                    } else {
                        checklistData[type] = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        }


        function selectFromGallery(type) {
            // Em um aplicativo real, isso abriria a galeria de fotos
            alert(`Em um aplicativo real, isso abriria a galeria para selecionar foto do ${type}.`);
            
            // Simulando uma foto selecionada
            const placeholder = document.getElementById(`${type}-placeholder`);
            const preview = document.getElementById(`${type}-preview`);
            const img = document.getElementById(`${type}-img`);
            
            // Usando uma imagem de exemplo para demonstração
            img.src = `https://via.placeholder.com/400x300?text=Foto+do+${type.replace('-', '+')}`;
            
            placeholder.classList.add('hidden');
            preview.classList.remove('hidden');
            
            // Armazenar no objeto de dados
            if (type === 'medidor' || type === 'bussola' || type === 'disjuntor') {
                checklistData[type].foto = img.src;
            } else {
                checklistData[type] = img.src;
            }
        }

        // Gerar relatório e enviar via WhatsApp
        
        function generateReport() {
            if (!checklistData.disjuntor.foto) {
                alert('Por favor, tire ou selecione uma foto do disjuntor.');
                return;
            }
            
            const amperagem = document.getElementById('amperagem').value;
            if (!amperagem) {
                alert('Por favor, selecione a amperagem do disjuntor.');
                return;
            }
            checklistData.disjuntor.amperagem = amperagem;
            
            let message = "✅ *Checklist Elétrico Completo* ✅

";
            message += "📸 *Fachada:* Foto anexada
";
            message += "🔌 *Padrão:* Foto anexada
";
            message += `⚡ *Tipo de Instalação:* ${checklistData.instalacao === 'aerea' ? 'Aérea' : 'Subterrânea'}
`;
            message += `📊 *Medidor:* ${checklistData.medidor.tipo === 'digital' ? 'Digital' : 'Analógico'} (foto anexada)
`;
            message += `🧭 *Coordenadas:* Lat ${checklistData.bussola.latitude}, Long ${checklistData.bussola.longitude}
`;
            message += `💡 *Disjuntor:* ${checklistData.disjuntor.amperagem} (foto anexada)

`;
            message += "Data: " + new Date().toLocaleString();

            navigator.clipboard.writeText(message).then(() => {
                window.open("https://web.whatsapp.com/", "_blank");
                alert("✅ Mensagem copiada! Agora é só colar no grupo do WhatsApp.");
            });

            resetForm();
            showStep(1);
        }


        function resetForm() {
            // Limpar todas as fotos e seleções
            document.querySelectorAll('[id$="-preview"]').forEach(preview => {
                preview.classList.add('hidden');
            });
            
            document.querySelectorAll('[id$="-placeholder"]').forEach(placeholder => {
                placeholder.classList.remove('hidden');
            });
            
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';
            document.getElementById('amperagem').value = '';
            
            // Limpar objeto de dados
            for (const key in checklistData) {
                if (typeof checklistData[key] === 'object') {
                    for (const subKey in checklistData[key]) {
                        checklistData[key][subKey] = null;
                    }
                } else {
                    checklistData[key] = null;
                }
            }
        }

        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
            updateProgress();
            
            // Simular obtenção de coordenadas (em um app real usaria geolocalização)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                    document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                }, error => {
                    console.error("Erro ao obter localização:", error);
                });
            }
        });