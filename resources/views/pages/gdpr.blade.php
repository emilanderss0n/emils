@extends('layouts.default')

@section('main-content')
<section class="gdpr-section">
    <div class="content-container">
        <div class="gdpr-header">
            <h1><i class="bi bi-shield-check"></i> Privacy Policy</h1>
            <p class="last-updated">Last updated: {{ date('F d, Y') }}</p>
        </div>
        
        <div class="gdpr-content">
            
            <div class="section">
                <h2>Introduction</h2>
                <p>Thank you for visiting my website. I respect your privacy and am committed to protecting any data that is collected when you visit. This privacy policy explains what information is collected, how it is used, and your rights regarding this data.</p>
            </div>
            
            <div class="section">
                <h2>Data Controller</h2>
                <p>For the purposes of applicable data protection laws, I am the data controller of the personal data collected through this website.</p>
            </div>
            
            <div class="section">
                <h2>What Data Is Collected</h2>
                <p>This website collects minimal data about visitors:</p>
                <ul>
                    <li><strong>Google Analytics data:</strong> This includes anonymous usage statistics such as pages visited, time spent on the site, referring websites, approximate geographical location (country/city level), browser type, and device type.</li>
                    <li><strong>Contact form submissions:</strong> If you choose to contact me through the website's contact form, I will collect the information you provide (such as your name, email address, and message content).</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>How Data Is Used</h2>
                <p>The data collected is used in the following ways:</p>
                <ul>
                    <li>To analyze website traffic and improve user experience</li>
                    <li>To respond to inquiries submitted through the contact form</li>
                    <li>To maintain the security and functionality of the website</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>Legal Basis for Processing</h2>
                <p>I process your data based on:</p>
                <ul>
                    <li><strong>Legitimate interest:</strong> To analyze website traffic patterns and improve the website</li>
                    <li><strong>Consent:</strong> For cookies and similar technologies as required by law</li>
                    <li><strong>Contract fulfillment:</strong> To respond to inquiries you submit</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>Data Sharing</h2>
                <p>I do not sell, trade, or otherwise transfer your information to third parties except in the following cases:</p>
                <ul>
                    <li><strong>Google Analytics:</strong> Data is processed by Google according to their privacy policy</li>
                    <li><strong>Service providers:</strong> I may use third-party services for website hosting and maintenance</li>
                    <li><strong>Legal requirements:</strong> I may disclose information when required by law</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>Cookies</h2>
                <p>This website uses cookies through Google Analytics to enhance your browsing experience. You can control cookies through your browser settings.</p>
            </div>
            
            <div class="section">
                <h2>Your Rights</h2>
                <p>Under GDPR, you have the following rights:</p>
                <ul>
                    <li>Right to access your data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>Data Retention</h2>
                <p>Google Analytics data is retained according to Google's retention policy. Contact form submissions are retained only as long as necessary to respond to your inquiry.</p>
            </div>
            
            <div class="section">
                <h2>Security</h2>
                <p>I take reasonable measures to protect your data, but no method of transmission over the internet is 100% secure.</p>
            </div>
            
            <div class="section">
                <h2>Contact Information</h2>
                <p>If you have questions about this privacy policy or wish to exercise your rights regarding your data, please contact me via the contact form on this website.</p>
            </div>
            
            <div class="section">
                <h2>Changes to This Policy</h2>
                <p>I may update this privacy policy from time to time. The latest version will always be posted on this page with the updated date at the top.</p>
            </div>
        </div>
    </div>
</section>
@endsection
