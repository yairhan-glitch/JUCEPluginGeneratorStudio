cmake_minimum_required(VERSION 3.24)
project({{PLUGIN_NAME}}_Plugin VERSION {{VERSION}})

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ===================================================================
# JUCE Framework Configuration
# ===================================================================
# Choose one of the following JUCE setup methods:

# Method 1: Using find_package (if JUCE is installed system-wide)
# Set CMAKE_PREFIX_PATH to JUCE install directory before running cmake
{{#if JUCE_PATH_MODE_find_package}}
find_package(JUCE CONFIG REQUIRED)
{{/if}}

# Method 2: Using add_subdirectory (for local JUCE development)
# Point to your local JUCE directory
{{#if JUCE_PATH_MODE_add_subdirectory}}
add_subdirectory({{JUCE_PATH}} juce)
{{/if}}

# ===================================================================
# Plugin Configuration
# ===================================================================
juce_add_plugin({{PLUGIN_NAME_IDENTIFIER}}
    # Basic Identity
    PRODUCT_NAME "{{PRODUCT_NAME}}"
    PLUGIN_NAME "{{PLUGIN_NAME}}"
    DESCRIPTION "{{DESCRIPTION}}"
    
    # Versioning
    VERSION {{VERSION}}
    BUILD_VERSION {{BUILD_VERSION}}
    BUNDLE_ID "{{BUNDLE_ID}}"
    
    # Company Information
    COMPANY_NAME "{{COMPANY_NAME}}"
    PLUGIN_MANUFACTURER_CODE "{{PLUGIN_MANUFACTURER_CODE}}"
    PLUGIN_CODE "{{PLUGIN_CODE}}"
    
    # Audio Capabilities
    IS_SYNTH {{IS_SYNTH}}
    NEEDS_MIDI_INPUT {{NEEDS_MIDI_INPUT}}
    NEEDS_MIDI_OUTPUT {{NEEDS_MIDI_OUTPUT}}
    IS_MIDI_EFFECT {{IS_MIDI_EFFECT}}
    EDITOR_WANTS_KEYBOARD_FOCUS {{EDITOR_WANTS_KEYBOARD_FOCUS}}
    
    # Plugin Formats
    FORMATS {{FORMATS}}
    
    # VST3 Specific Settings
    VST3_CATEGORIES {{VST3_CATEGORIES}}
    
    # macOS/iOS Permissions
    {{#if MICROPHONE_PERMISSION_ENABLED}}
    MICROPHONE_PERMISSION_ENABLED TRUE
    MICROPHONE_PERMISSION_TEXT "{{MICROPHONE_PERMISSION_TEXT}}"
    {{/if}}
    {{#if CAMERA_PERMISSION_ENABLED}}
    CAMERA_PERMISSION_ENABLED TRUE
    {{/if}}
    {{#if BLUETOOTH_PERMISSION_ENABLED}}
    BLUETOOTH_PERMISSION_ENABLED TRUE
    {{/if}}
    
    # Build Settings
    COPY_PLUGIN_AFTER_BUILD FALSE
)

# ===================================================================
# Source Files
# ===================================================================
target_sources({{PLUGIN_NAME_IDENTIFIER}} PRIVATE
    Source/PluginProcessor.cpp
    Source/PluginEditor.cpp
)

# ===================================================================
# JUCE Module Linking
# ===================================================================
target_link_libraries({{PLUGIN_NAME_IDENTIFIER}}
    PRIVATE
        juce::juce_audio_basics
        juce::juce_audio_devices
        juce::juce_audio_formats
        juce::juce_audio_plugin_client
        juce::juce_audio_processors
        juce::juce_audio_utils
        juce::juce_core
        juce::juce_data_structures
        juce::juce_dsp
        juce::juce_events
        juce::juce_graphics
        juce::juce_gui_basics
        juce::juce_gui_extra
)

# ===================================================================
# Compiler Definitions
# ===================================================================
target_compile_definitions({{PLUGIN_NAME_IDENTIFIER}} PUBLIC
    JUCE_VST3_CAN_REPLACE_VST2=0
    JUCE_USE_CURL=0
    JUCE_WEB_BROWSER=0
    {{#if IS_SYNTH}}
    JUCE_PLUGIN_IS_SYNTH=1
    {{/if}}
)
