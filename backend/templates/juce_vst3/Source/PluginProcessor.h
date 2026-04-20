#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

/**
 * {{PLUGIN_NAME}} - {{COMPANY_NAME}}
 * 
 * A JUCE VST3 {{#if IS_SYNTH}}synthesizer{{else}}audio effect{{/if}} plugin
 * Plugin Code: {{PLUGIN_CODE}}
 */
class {{PLUGIN_NAME_IDENTIFIER}}Processor : public juce::AudioProcessor
{
public:
    // Constructor and destructor
    {{PLUGIN_NAME_IDENTIFIER}}Processor();
    ~{{PLUGIN_NAME_IDENTIFIER}}Processor() override;

    // AudioProcessor interface
    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    
    void processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages) override;
    void processBlockBypassed(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages) override;

    // Editor
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }

    // Plugin info
    const juce::String getName() const override { return "{{PLUGIN_NAME}}"; }
    bool acceptsMidi() const override { return {{MIDI_INPUT}}; }
    bool producesMidi() const override { return {{MIDI_OUTPUT}}; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }

    // Program handling
    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram(int) override {}
    const juce::String getProgramName(int) override { return "Default"; }
    void changeProgramName(int, const juce::String&) override {}

    // State management
    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

private:
    // Audio processing state
    double sampleRate = 44100.0;
    int blockSize = 512;
    
    // Parameters (add your own here)
    float gainParam = 1.0f;  // Default unity gain (pass-through)
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR({{PLUGIN_NAME_IDENTIFIER}}Processor)
};
