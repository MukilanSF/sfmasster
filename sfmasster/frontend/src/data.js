    apex: {
        beginner: [],
        intermediate: [],
        master: []
    }
    <div class="container">
        <lightning-button 
            label="Toggle Message" 
            onclick={handleClick}
            variant="brand"
            class="toggle-btn">
        </lightning-button>
        
        <div if:true={showMessage} class="message">
            <p>🎉 Hello! This message appears when you click the button.</p>
        </div>
    </div>
</template>`,
        html: `<template>
          css: `.container {
    padding: 20px;
    max-width: 400px;
}

.toggle-btn {
    margin-bottom: 15px;
}

.message {
    padding: 15px;
    background-color: #f3f3f3;
    border-radius: 8px;
        css: `.container {
    border-left: 4px solid #0176d3;
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}`,
          xml: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>`
        },
        testCode: `// Test Cases:
// 1. Button click toggles message visibility
// 2. Verify showMessage property changes on click
// 3. Check conditional rendering works with if:true
// 4. Ensure proper event handling and UI updates`,
        hints: [
          'Use a boolean property to track message visibility',
          'Create a click handler method that toggles the boolean',
          'Use if:true directive for conditional rendering',
          'Use lightning-button component for consistent styling'
        ]
      }
    ],
    intermediate: [
      {
        id: 'lwc-intermediate-1',
        title: 'Dynamic Data Table',
        level: 'intermediate',
        description: 'Create a component that displays data in a table format with sorting capabilities. Learn data manipulation and user interactions.',
        starterCode: {
          js: `import { LightningElement } from 'lwc';

export default class DataTable extends LightningElement {
    // Add your properties and methods here
    // Create data array, sorting properties, and sort method
}`,
          html: `<template>
    <!-- Add your HTML here -->
    <!-- Create a table with sortable headers -->
</template>`,
          css: `/* Add your CSS styles here */
/* Style the table and sorting indicators */`,
          xml: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>`
        },
        solution: {
          js: `import { LightningElement } from 'lwc';

export default class DataTable extends LightningElement {
    data = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' }
    ];
    
    sortedData = [...this.data];
    sortField = '';
    sortDirection = 'asc';
    
    handleSort(event) {
        const field = event.target.dataset.field;
        
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        
        this.sortedData = [...this.data].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];
            
            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
        hints: [
            'Use a boolean property to track message visibility',
            'Create a click handler method that toggles the boolean',
            'Use if:true directive for conditional rendering',
            'Use lightning-button component for consistent styling'
        ]
    get sortIcon() {
        return this.sortDirection === 'asc' ? '↑' : '↓';
    }
}`,
          html: `<template>
    <div class="table-container">
        <h2>User Data Table</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>
                        <button data-field="name" onclick={handleSort} class="sort-button">
                            Name {sortField === 'name' ? sortIcon : ''}
                        </button>
                    </th>
                    <th>
                        <button data-field="email" onclick={handleSort} class="sort-button">
                            Email {sortField === 'email' ? sortIcon : ''}
                        </button>
                    </th>
                    <th>
                        <button data-field="role" onclick={handleSort} class="sort-button">
                            Role {sortField === 'role' ? sortIcon : ''}
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr for:each={sortedData} for:item="row" key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>
                        <span class={row.role}>{row.role}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>`,
          css: `.table-container {
    padding: 20px;
    max-width: 800px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.data-table th,
.data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.data-table th {
    background-color: #f8f9fa;
    font-weight: bold;
}

.sort-button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #0176d3;
}

.sort-button:hover {
    text-decoration: underline;
}

.Admin {
    background-color: #d4edda;
    color: #155724;
    padding: 4px 8px;
    border-radius: 4px;
}

.Manager {
    background-color: #fff3cd;
    color: #856404;
    padding: 4px 8px;
    border-radius: 4px;
}

.User {
    background-color: #cce5ff;
    color: #004085;
    padding: 4px 8px;
    border-radius: 4px;
}`,
          xml: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>`
        },
        testCode: `// Test Cases:
// 1. Table displays all data rows correctly
// 2. Clicking column headers sorts data ascending/descending
// 3. Sort indicators show current sort direction
// 4. Role badges display with proper styling
// 5. Table is responsive and accessible`,
        hints: [
          'Use for:each directive to iterate over data',
          'Implement sorting logic that toggles direction',
          'Use data attributes to identify sort fields',
          'Create a getter for dynamic sort indicators'
        ]
      }
    ],
    master: [
      {
        id: 'lwc-master-1',
        title: 'Advanced Form with Validation',
        level: 'master',
        description: 'Create a complex form component with real-time validation, custom error handling, and dynamic field behavior.',
        starterCode: {
          js: `import { LightningElement } from 'lwc';

export default class AdvancedForm extends LightningElement {
    // Add your properties and methods here
    // Implement form validation, error handling, and submission
}`,
          html: `<template>
    <!-- Add your HTML here -->
    <!-- Create a form with validation and error display -->
</template>`,
          css: `/* Add your CSS styles here */
/* Style the form, validation states, and error messages */`,
          xml: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>`
        },
        solution: {
          js: `import { LightningElement, track } from 'lwc';

export default class AdvancedForm extends LightningElement {
    @track formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: ''
    };
    
    @track errors = {};
    @track isSubmitting = false;
    @track isSubmitted = false;
    
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        
        this.formData = { ...this.formData, [field]: value };
        
        // Clear error when user starts typing
        if (this.errors[field]) {
            this.errors = { ...this.errors, [field]: null };
        }
        
        // Real-time validation
        this.validateField(field, value);
    }
    
    validateField(field, value) {
        let error = null;
        
        switch(field) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    error = 'This field is required';
                } else if (value.length < 2) {
                    error = 'Must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email';
                }
                break;
            case 'phone':
                const phoneRegex = /^\d{10}$/;
                if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
                    error = 'Please enter a valid 10-digit phone number';
                }
                break;
        }
        
        this.errors = { ...this.errors, [field]: error };
    }
    
    validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            this.validateField(field, this.formData[field]);
            if (this.errors[field]) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.isSubmitting = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.isSubmitted = true;
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            this.isSubmitting = false;
        }
    }
    
    handleReset() {
        this.formData = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            company: ''
        };
        this.errors = {};
        this.isSubmitted = false;
    }
    
    get isFormValid() {
        return Object.values(this.errors).every(error => !error) && 
               this.formData.firstName && this.formData.lastName && this.formData.email;
    }
}`,
          html: `<template>
    <div class="form-container">
        <div if:false={isSubmitted}>
            <h2>Contact Information Form</h2>
            <form onsubmit={handleSubmit} class="advanced-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input 
                            type="text" 
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onchange={handleInputChange}
                            class={errors.firstName ? 'error' : ''}
                            required>
                        <div if:true={errors.firstName} class="error-message">
                            {errors.firstName}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input 
                            type="text" 
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onchange={handleInputChange}
                            class={errors.lastName ? 'error' : ''}
                            required>
                        <div if:true={errors.lastName} class="error-message">
                            {errors.lastName}
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onchange={handleInputChange}
                        class={errors.email ? 'error' : ''}
                        required>
                    <div if:true={errors.email} class="error-message">
                        {errors.email}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onchange={handleInputChange}
                        class={errors.phone ? 'error' : ''}
                        placeholder="(555) 123-4567">
                    <div if:true={errors.phone} class="error-message">
                        {errors.phone}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="company">Company</label>
                    <input 
                        type="text" 
                        id="company"
                        name="company"
                        value={formData.company}
                        onchange={handleInputChange}>
                </div>
                
                <div class="form-actions">
                    <button 
                        type="submit" 
                        class="submit-btn"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                    <button 
                        type="button" 
                        class="reset-btn"
                        onclick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
        
        <div if:true={isSubmitted} class="success-message">
            <h2>✅ Form Submitted Successfully!</h2>
            <p>Thank you for your submission. We'll be in touch soon.</p>
            <button onclick={handleReset} class="new-form-btn">
                Submit Another Form
            </button>
        </div>
    </div>
</template>`,
          css: `.form-container {
    max-width: 600px;
    padding: 20px;
    margin: 0 auto;
}

.advanced-form {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-row {
    display: flex;
    gap: 20px;
}

.form-group {
    margin-bottom: 20px;
    flex: 1;
}

.form-group label {
    display: block;
    export const mockChallenges = {
        apex: {}
    };
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #0176d3;
}

.form-group input.error {
    border-color: #d32f2f;
}

.error-message {
    color: #d32f2f;
    font-size: 12px;
    margin-top: 5px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.submit-btn {
    background-color: #0176d3;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
    background-color: #014486;
}

.submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.reset-btn {
    background-color: #6c757d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.reset-btn:hover {
    background-color: #545b62;
}

.success-message {
    text-align: center;
    padding: 40px;
    background: #d4edda;
    border-radius: 8px;
    color: #155724;
}

.new-form-btn {
    background-color: #28a745;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}`,
          xml: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
</LightningComponentBundle>`
        },
        testCode: `// Test Cases:
// 1. Form validates required fields on submission
// 2. Real-time validation shows/hides errors as user types
// 3. Email validation accepts valid formats only
// 4. Phone validation accepts 10-digit numbers
// 5. Form submission shows loading state and success message
// 6. Reset button clears all fields and errors
// 7. Submit button is disabled during submission`,
        hints: [
          'Use @track decorator for reactive properties',
          'Implement real-time validation on input change',
          'Use regular expressions for email and phone validation',
          'Handle form submission with async/await pattern',
          'Provide visual feedback for all user interactions'
        ]
      }
    ]
  }
};

// Motivational quotes for the editor
export const motivationalQuotes = [
  "Developers don't quit. 💪",
  "Consistency is the key. 🔑",
  "This is a one way journey. No turning back. 🚀",
  "Start a beginner. Return as a Master. 🎯",
  "Every teacher was once a student. 📚",
  "Code is poetry written in logic. ✨",
  "Debug your way to greatness. 🐛➡️🏆",
  "Every error is a lesson in disguise. 🎭",
  "Think in code, dream in solutions. 💭",
  "The best code is yet to be written. 📝"
];

// Encouragement messages for different scenarios
export const encouragementMessages = {
  failure: [
    "Think better, you've got this! 🤔💪",
    "Every expert was once a beginner. Keep going! 🌱",
    "Debugging is like being a detective. Find those clues! 🕵️",
    "Rome wasn't built in a day, neither is great code. 🏛️"
  ],
  almostThere: [
    "Almost there! You're so close! 🎯",
    "One more push and you'll crack it! 💥",
    "The finish line is in sight! 🏁",
    "You're on the right track! Keep going! 🛤️"
  ],
  success: [
    "Brilliant! You've mastered this challenge! 🌟",
    "Outstanding work! Ready for the next level? 🚀",
    "Perfect execution! You're becoming a true master! 👑",
    "Exceptional! Your coding skills are evolving! 🦋"
  ]
};