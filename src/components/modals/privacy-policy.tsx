"use client";
import Modal from "@/components/common/containers/modal";
import React, { } from "react";
import { useTranslation } from "react-i18next";

const SpanishPolicy = () => (<> <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Introducción</h2>
  <p className="mb-4">Bienvenido a GESTIÓN INMOBILIARIA Y MARÍTIMA. Al acceder o utilizar nuestro sitio web y servicios, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. Por favor, lea estos términos cuidadosamente antes de utilizar nuestros servicios. Si no está de acuerdo con estos términos, por favor no utilice nuestro sitio web.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Recolección y Uso de Datos</h2>
  <h3 className="text-xl font-semibold mt-4 mb-2">Datos de Reserva e Información de Identidad</h3>
  <p className="mb-2"><strong>Datos Recogidos:</strong> Recogemos datos de reserva e información de identidad para facilitar sus reservas y proporcionar nuestros servicios.</p>
  <p className="mb-2"><strong>Propósito:</strong> Los datos recogidos se utilizan exclusivamente dentro de nuestra empresa para completar reservas y para contactos promocionales. No compartimos sus datos con terceros.</p>
  <p className="mb-4"><strong>Retención:</strong> Sus datos serán almacenados de forma segura en nuestro sistema durante el tiempo necesario para cumplir con los propósitos descritos en esta política.</p>

  <h3 className="text-xl font-semibold mt-4 mb-2">Cookies</h3>
  <p className="mb-2"><strong>Cookies de Terceros:</strong> Utilizamos cookies de terceros únicamente para rastrear la actividad del usuario en nuestra página web. Esto nos ayuda a mejorar la usabilidad y gestionar errores de manera efectiva.</p>
  <p className="mb-4"><strong>Gestión de Cookies:</strong> Al usar nuestro sitio web, usted consiente el uso de cookies. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Privacidad</h2>
  <p className="mb-4">Su privacidad es importante para nosotros. Nos comprometemos a proteger su información personal. Por favor, consulte nuestra Política de Privacidad para obtener información detallada sobre cómo manejamos sus datos.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Seguridad</h2>
  <p className="mb-4">Implementamos medidas de seguridad adecuadas para proteger sus datos de acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión a través de internet o almacenamiento electrónico es 100% seguro.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Obligaciones del Usuario</h2>
  <p className="mb-4">Al utilizar nuestros servicios, usted acepta:</p>
  <ul className="list-disc list-inside mb-4">
    <li>Proporcionar información precisa y completa durante el proceso de reserva.</li>
    <li>Utilizar nuestros servicios en cumplimiento con todas las leyes y regulaciones aplicables.</li>
    <li>No participar en ninguna actividad que pueda dañar la funcionalidad o seguridad de nuestro sitio web.</li>
  </ul>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Propiedad Intelectual</h2>
  <p className="mb-4">Todo el contenido, logotipos, marcas comerciales y otra propiedad intelectual mostrada en nuestro sitio web son propiedad de GESTIÓN INMOBILIARIA Y MARÍTIMA. Usted no puede usar ninguna de nuestra propiedad intelectual sin el consentimiento previo por escrito.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Limitación de Responsabilidad</h2>
  <p className="mb-4">GESTIÓN INMOBILIARIA Y MARÍTIMA no será responsable de ningún daño directo, indirecto, incidental o consecuente que surja del uso o la imposibilidad de uso de nuestros servicios o de cualquier error u omisión en el contenido de nuestro sitio web.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Cambios en los Términos y Condiciones</h2>
  <p className="mb-4">Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Cualquier cambio será efectivo inmediatamente después de ser publicado en nuestro sitio web. Su uso continuo de nuestros servicios constituye la aceptación de los términos revisados.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Información de Contacto</h2>
  <p>Si tiene alguna pregunta o inquietud sobre estos términos y condiciones, por favor contáctenos en:</p>
</>)

const EnglishPolicy = () => (<><h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
  <p className="mb-4">Welcome to REAL ESTATE AND MARINE MANAGEMENT. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services. If you do not agree to these terms, please do not use our website.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Data Collection and Use</h2>
  <h3 className="text-xl font-semibold mt-4 mb-2">Booking Data and Identity Information</h3>
  <p className="mb-2"><strong>Data Collected:</strong> We collect booking data and identity information to facilitate your bookings and provide our services.</p>
  <p className="mb-2"><strong>Purpose:</strong> The collected data is used exclusively within our company to complete bookings and for promotional contacts. We do not share your data with third parties.</p>
  <p className="mb-4"><strong>Retention:</strong> Your data will be securely stored in our system for the duration necessary to fulfill the purposes outlined in this policy.</p>

  <h3 className="text-xl font-semibold mt-4 mb-2">Cookies</h3>
  <p className="mb-2"><strong>Third-Party Cookies:</strong> We use third-party cookies solely to track user activity on our webpage. This helps us improve usability and manage errors effectively.</p>
  <p className="mb-4"><strong>Cookie Management:</strong> By using our website, you consent to the use of cookies. You can manage your cookie preferences through your browser settings.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Privacy</h2>
  <p className="mb-4">Your privacy is important to us. We are committed to protecting your personal information. Please refer to our Privacy Policy for detailed information on how we handle your data.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Security</h2>
  <p className="mb-4">We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">User Obligations</h2>
  <p className="mb-4">By using our services, you agree to:</p>
  <ul className="list-disc list-inside mb-4">
    <li>Provide accurate and complete information during the booking process.</li>
    <li>Use our services in compliance with all applicable laws and regulations.</li>
    <li>Not engage in any activity that could harm the functionality or security of our website.</li>
  </ul>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Intellectual Property</h2>
  <p className="mb-4">All content, logos, trademarks, and other intellectual property displayed on our website are the property of REAL ESTATE AND MARINE MANAGEMENT. You may not use any of our intellectual property without prior written consent.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
  <p className="mb-4">REAL ESTATE AND MARINE MANAGEMENT shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services or from any errors or omissions in the content of our website.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to Terms and Conditions</h2>
  <p className="mb-4">We reserve the right to modify these terms and conditions at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the revised terms.</p>

  <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Information</h2>
  <p>If you have any questions or concerns regarding these terms and conditions, please contact us at:</p></>

)

export default function PrivacyPolicy({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { i18n } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={() => closeModal()}>
      <div className="relative p-2 md:w-[60%] bg-white rounded-lg shadow overflow-y-scroll pt-0 w-[95%] h-[95%] md:px-12 px-2 pt-4">
        {i18n.language === "es" ? <SpanishPolicy /> : <EnglishPolicy />}
        <p className="mb-4">
          REAL ESTATE AND MARINE MANAGEMENT<br />
          San Leandro 8 ESC IZQ 1ºB  - 30204
          CARTAGENA – MURCIA
          <br />
          <a href="mailto:info@mediterraneamarine.com" className="text-blue-500 underline">info@mediterraneamarine.com</a><br />
          +34 686 59 84 18
        </p>
      </div>
    </Modal>
  );
}
