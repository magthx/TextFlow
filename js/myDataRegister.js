// Importar las funciones necesarias de Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAu-Et1TK0t-i04xaMgpmDDGDN6aarm7DI",
    authDomain: "textflow-7d357.firebaseapp.com",
    projectId: "textflow-7d357",
    storageBucket: "textflow-7d357.appspot.com",
    messagingSenderId: "652709206886",
    appId: "1:652709206886:web:d054e1d2b2ff381e2dc6a7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Registro de usuario
const thisRegisterForm = document.getElementById('thisRegisterForm');
thisRegisterForm.addEventListener('submit', async (event) => {
    event.preventDefault();


    let textoCorreo = document.getElementById('textoCorreo').value.toLowerCase();
    let textoCifrado = document.getElementById('textoCifrado').value;
    let usuarioPublico = document.getElementById('usuarioPublico').value.toLowerCase();

    // VARIABLES DE DATOS (ELEMENTOS A RESETEAR REGISTER)
    let textoCorreoElement = document.getElementById('textoCorreo');
    let textoCifradoElement = document.getElementById('textoCifrado');
    let usuarioPublicoElement = document.getElementById('usuarioPublico');

    try {
        // Verificar si el nombre de usuario ya existe
        const userQuery = query(collection(db, 'users'), where('username', '==', usuarioPublico));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            // Si el nombre de usuario ya existe
            Swal.fire({
                icon: 'error',
                title: 'Nombre de Usuario Existente',
                text: 'El nombre de usuario ya está en uso. Por favor, elige otro.'
            });
            return;
        }

        // Crear usuario con correo y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, textoCorreo, textoCifrado);
        const user = userCredential.user;

        // Guardar el nombre de usuario y el correo electrónico en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: textoCorreo,
            username: usuarioPublico
        });

        // Mostrar éxito
        Swal.fire({
            icon: 'success',
            html: `<span>Bienvenido <strong>${usuarioPublico}</strong></span>`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didClose: () => {
                window.location.href = '/TextFlow/index.html';
            }
        });
    } catch (error) {
        textoCorreoElement.value = '';
        textoCifradoElement.value = '';
        usuarioPublicoElement.value = '';

        // Deshabilitar campos y mostrar mensaje
        function deshabilitarCamposElementosRegistro() {
            textoCorreoElement.disabled = true;
            textoCorreoElement.placeholder = 'Espere 3 segundos..';

            textoCifradoElement.disabled = true;
            textoCifradoElement.placeholder = 'Espere 3 segundos..';

            usuarioPublicoElement.disabled = true;
            usuarioPublicoElement.placeholder = 'Espere 3 segundos..';
        }
        deshabilitarCamposElementosRegistro();

        setTimeout(() => {
            textoCorreoElement.disabled = false;
            textoCorreoElement.placeholder = 'Ingresa tu correo';

            textoCifradoElement.disabled = false;
            textoCifradoElement.placeholder = 'Tu clave';

            usuarioPublicoElement.disabled = false;
            usuarioPublicoElement.placeholder = 'Usuario';
        }, 3000);

        // Mostrar error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el usuario. ' + error.message
        });

    } finally {
        toggleForm(thisRegisterForm, false);
    }
});

// Login de usuario
const thisLoginForm = document.getElementById('thisLoginForm');
thisLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textoCorreoLogin = document.getElementById('textoCorreoLogin').value.toLowerCase();
    const textoCifradoLogin = document.getElementById('textoCifradoLogin').value;

    try {
        // Iniciar sesión con correo y contraseña
        const userCredential = await signInWithEmailAndPassword(auth, textoCorreoLogin, textoCifradoLogin);
        const user = userCredential.user;

        // Obtener el nombre de usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            Swal.fire({
                icon: 'success',
                html: `<span>Bienvenido de nuevo! <strong>${userData.username}</strong></span>`,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                didClose: () => {
                    window.location.href = '/TextFlow/index.html';
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                html: 'Usuario no encontrado.'
            });
        }
    } catch (error) {
        // RESETEAR VALORES (ANTISPAM)
        const textoCorreoLogin = document.getElementById('textoCorreoLogin');
        const textoCifradoLogin = document.getElementById('textoCifradoLogin');

        textoCorreoLogin.value = '';
        textoCifradoLogin.value = '';

        function preventSX() {
            textoCorreoLogin.placeholder = 'Espere 3 segundos..';
            textoCorreoLogin.disabled = true;

            textoCifradoLogin.disabled = true;
            textoCifradoLogin.placeholder = 'Espere 3 segundos';
        }
        preventSX();

        setTimeout(() => {
            textoCorreoLogin.placeholder = 'Ingresa tu correo';
            textoCorreoLogin.disabled = false;

            textoCifradoLogin.disabled = false;
            textoCifradoLogin.placeholder = 'Tu clave';
        }, 3000);

        // Mostrar error
        Swal.fire({
            icon: 'error',
            toast: true,
            timer: 3000,
            position: 'top-end',
            html: `${error.message}`,
            showConfirmButton: false
        });
    }
});

// DECLARANDO TODAS LAS VARIABLES Y FUNCIONES GENERALES
const thisULogin = document.getElementById('thisULogin');

// FUNCIONES PRINCIPALES
thisULogin.addEventListener('click', () => {
    Swal.fire({
        imageUrl: '../assets/secondPolice_OfficerPixel_Art.gif',
        html: `
        <ul style='list-style:none;'>
            <li>Evita el spam :)</li> 
            <li>Utiliza nombres cortos</li> 
            <li>Evita la información personal</li>
            <strong>Evita utilizar correos personales</strong>
        </ul>
        `,
        timer: 6000,
        timerProgressBar: true
    });
});

// FUNCION CARGA DE PAGINA
window.onload = function () {
    Swal.fire({
        imageUrl: '../assets/firstScript_TablePixelArt.gif',
        html: `<li style='list-style:none;'>Por favor lee las reglas :)</li>`,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false
    });
}
