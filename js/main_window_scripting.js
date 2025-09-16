// Importar las funciones necesarias de Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAu-Et1TK0t-i04xaMgpmDDGDN6aarm7DI",
    authDomain: "textflow-7d357.firebaseapp.com",
    projectId: "textflow-7d357",
    appId: "1:652709206886:web:d054e1d2b2ff381e2dc6a7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const thisDatabase = getDatabase(app);
const firestore = getFirestore(app);
const injection_gray_circle_chat = document.getElementById('injection_gray_circle_chat')

// Manejo del estado de autenticación
onAuthStateChanged(auth, async (user) => { // Marcamos la función como `async`
    if (user) {
        inyeccion_email.textContent = `${user.email}`;
        injection_gray_circle_chat.className = 'fas fa-circle';
        try {
            // Obtener los datos del usuario desde Firestore
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                inyeccion_user.textContent = `${userData.username}`;
            } else {
                Swal.fire({
                    icon: 'error',
                    html: `Documento del usuario no encontrado. Serás redirigido`,
                    didClose: () => {
                        window.location.href = '/TextFlow/register/';
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: `${error}`,
                didClose: () => {
                    window.location.href = '/TextFlow/register/';
                }
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            html: `No tienes una cuenta, porfavor crea una.`,
            didClose: () => {
                window.location.href = '/TextFlow/register/';
            }
        });
    }
});

// VENTANA EN GENERAL //
const logo_account = document.getElementById('logo-account');
const ul_user = document.getElementById('ul-user');
const injection_span_main_interface = document.getElementById('injection-span-main-interface');
injection_span_main_interface.textContent = `Sala general`;
logo_account.addEventListener('click', () => {
    if (ul_user.style.display === 'none' || ul_user.style.display === '') {
        ul_user.style.display = 'flex';
    } else {
        ul_user.style.display = 'none';
    }
});

// FUNCIONALIDADES PRINCIPALES DE LA VENTANA //
const send_user_form = document.getElementById('send--user--form');
send_user_form.addEventListener('click', (event) => {
    event.preventDefault();
    let text_input_from_user = document.getElementById('text--input-from-user').value;
    text_input_from_user = text_input_from_user.replace(/\s+/g, ' ');
    text_input_from_user = text_input_from_user.trim();
    text_input_from_user = text_input_from_user.toLowerCase();
    if (text_input_from_user < 1) {
        return;
    } else {

        // EMPIEZA LO NUEVO //

        onAuthStateChanged(auth, async (user) => { // Marcamos la función como `async`
            if (user) {
                inyeccion_email.textContent = `${user.email}`;
                try {
                    // Obtener los datos del usuario desde Firestore
                    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        inyeccion_user.textContent = `${userData.username}`;

                        const thisUserData = ref(thisDatabase, 'textFlow');
                        push(thisUserData, {
                            message: `${text_input_from_user}`,
                            usuario: `${userData.username}`
                        }).then(() => {
                            // accion de subida a firebase exitosa //
                        }).catch(() => {
                            Swal.fire(({
                                icon: 'error',
                                html: `${error.message}`
                            }));
                        });

                        function activarFormulario() {
                            let text_input_from_user = document.getElementById('text--input-from-user');
                            text_input_from_user.disabled = false;
                            text_input_from_user.value = '';
                            text_input_from_user.placeholder = 'Escribe tu mensaje..';
                            text_input_from_user.focus();
                        }

                        function desactivarFormulario() {
                            let text_input_from_user = document.getElementById('text--input-from-user');
                            text_input_from_user.disabled = true;
                            text_input_from_user.value = '';
                            text_input_from_user.placeholder = 'Espere 3 segundos..';
                        } desactivarFormulario();

                        setTimeout(() => {
                            activarFormulario();
                        }, 3000)

                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: `Documento del usuario no encontrado. Serás redirigido`,
                            didClose: () => {
                                window.location.href = '/TextFlow/register/';
                            }
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        html: `${error}`,
                        didClose: () => {
                            window.location.href = '/TextFlow/register/';
                        }
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    html: `No tienes una cuenta, porfavor crea una.`,
                    didClose: () => {
                        window.location.href = '/TextFlow/register/';
                    }
                });
            }
        });
    }
});
window.onload = function () {
    //father
    let obtenerPadreAllMessage = document.getElementById('user-main-app-window');

    const lecturaMensajes = () => {
        const referenciaLectura = ref(thisDatabase, 'textFlow');

        onValue(referenciaLectura, (snapshot) => {
            const obtenerRecuadroMensajes = document.getElementById('user-interface-main-screen');
            function moveToMessage() {
                obtenerRecuadroMensajes.scrollTo({
                    top: obtenerRecuadroMensajes.scrollHeight,
                    behavior: 'smooth'
                });
            }
            setTimeout(() => {
                moveToMessage();
            }, 300)
            const datos = snapshot.val();
            obtenerPadreAllMessage.innerHTML = '';

            Object.values(datos).forEach(item => {
                const newDivMessage = document.createElement('div');
                const ul = document.createElement('ul');
                const li = document.createElement('li');
                const strong = document.createElement('strong');
                const span = document.createElement('span');

                newDivMessage.classList.add('this--message-newDivMessage')

                strong.textContent = `${item.usuario}:`
                span.textContent = item.message;

                li.appendChild(strong);
                li.appendChild(span);
                ul.appendChild(li)
                newDivMessage.appendChild(ul);
                obtenerPadreAllMessage.appendChild(newDivMessage);
            });
        });

    }
    lecturaMensajes();
}