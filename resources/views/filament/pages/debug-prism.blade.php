<x-filament-panels::page>
    <x-filament::section>
        <div class="flex items-center space-x-2 mb-4">
            <x-filament::icon icon="heroicon-o-bug-ant" class="w-6 h-6 text-primary-500" />
            <h2 class="text-xl font-bold">AI Integration Debugger</h2>
        </div>
        <p class="text-gray-500 dark:text-gray-400">
            This tool helps diagnose AI integration issues in the development environment.
        </p>
    </x-filament::section>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <x-filament::section>
            <x-slot name="heading">Configuration Status</x-slot>
            <dl class="divide-y divide-gray-200 dark:divide-gray-700">
                <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">API Key</dt>
                    <dd class="text-sm font-medium">
                        @if(env('OPENAI_API_KEY'))
                            <span class="text-success-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-check-circle" class="w-4 h-4 mr-1" />
                                Set
                            </span>
                        @else
                            <span class="text-danger-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-x-circle" class="w-4 h-4 mr-1" />
                                Missing
                            </span>
                        @endif
                    </dd>
                </div>
                <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">API Key Format</dt>
                    <dd class="text-sm font-medium">
                        @if(preg_match('/^sk-[a-zA-Z0-9-_]{16,}$/', env('OPENAI_API_KEY')))
                            <span class="text-success-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-check-circle" class="w-4 h-4 mr-1" />
                                Valid
                            </span>
                        @else
                            <span class="text-warning-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-exclamation-triangle" class="w-4 h-4 mr-1" />
                                Unusual format
                            </span>
                        @endif
                    </dd>
                </div>
                <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Key Type</dt>
                    <dd class="text-sm font-medium">
                        {{ strpos(env('OPENAI_API_KEY'), 'sk-proj-') === 0 ? 'Project-scoped' : 'User-scoped' }}
                    </dd>
                </div>
                <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Prism Server</dt>
                    <dd class="text-sm font-medium">
                        @if(env('PRISM_SERVER_ENABLED'))
                            <span class="text-success-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-check-circle" class="w-4 h-4 mr-1" />
                                Enabled
                            </span>
                        @else
                            <span class="text-warning-500 flex items-center">
                                <x-filament::icon icon="heroicon-o-exclamation-triangle" class="w-4 h-4 mr-1" />
                                Disabled
                            </span>
                        @endif
                    </dd>
                </div>
            </dl>
        </x-filament::section>
        
        <x-filament::section>
            <x-slot name="heading">Troubleshooting</x-slot>
            <div class="space-y-4">
                <div>
                    <h4 class="font-medium text-sm">Rate Limit Issues</h4>
                    <ul class="list-disc list-inside mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>Free tier accounts have usage limitations</li>
                        <li>Wait 20 seconds between API calls</li>
                        <li>Consider upgrading to a paid OpenAI account</li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium text-sm">Testing</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Use the "Test with Mock" button to verify the application without making API calls.
                        Use "Test API Connection" to verify your OpenAI connection.
                    </p>
                </div>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
