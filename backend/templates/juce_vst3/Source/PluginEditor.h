#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "PluginProcessor.h"

/**
 * {{PLUGIN_NAME}} Editor
 * 
 * Visual UI for the {{PLUGIN_NAME}} plugin
 * Provides controls for plugin parameters
 */
class {{PLUGIN_NAME_IDENTIFIER}}Editor : public juce::AudioProcessorEditor
{
public:
    {{PLUGIN_NAME_IDENTIFIER}}Editor({{PLUGIN_NAME_IDENTIFIER}}Processor& processor);
    ~{{PLUGIN_NAME_IDENTIFIER}}Editor() override;

    // GUI rendering
    void paint(juce::Graphics& g) override;
    void resized() override;

private:
    // Reference to the processor
    {{PLUGIN_NAME_IDENTIFIER}}Processor& processor;

    // UI Components (add your controls here)
    juce::Label titleLabel;
    juce::Label infoLabel;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR({{PLUGIN_NAME_IDENTIFIER}}Editor)
};
