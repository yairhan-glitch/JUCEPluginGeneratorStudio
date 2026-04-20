#include "PluginProcessor.h"
#include "PluginEditor.h"

/**
 * Constructor
 */
{{PLUGIN_NAME_IDENTIFIER}}Processor::{{PLUGIN_NAME_IDENTIFIER}}Processor()
    : AudioProcessor(BusesProperties()
        .withInput("Input", juce::AudioChannelSet::stereo(), true)
        .withOutput("Output", juce::AudioChannelSet::stereo(), true))
{
}

/**
 * Destructor
 */
{{PLUGIN_NAME_IDENTIFIER}}Processor::~{{PLUGIN_NAME_IDENTIFIER}}Processor()
{
}

/**
 * Prepare for playback
 * Called when DAW starts playback
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::prepareToPlay(double incomingSampleRate, int incomingBlockSize)
{
    sampleRate = incomingSampleRate;
    blockSize = incomingBlockSize;
    
    DBG("{{PLUGIN_NAME}} - Prepared for playback");
    DBG("  Sample Rate: " + juce::String(sampleRate));
    DBG("  Block Size: " + juce::String(blockSize));
}

/**
 * Release resources
 * Called when DAW stops playback
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::releaseResources()
{
    // Clean up any allocated resources here
}

/**
 * Main audio processing callback
 * Process each block of audio
 * 
 * For a pass-through effect, we leave the audio buffer unchanged
 * (or apply unity gain/minimal processing)
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::processBlock(juce::AudioBuffer<float>& buffer, 
                                                        juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;
    auto totalNumInputChannels = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    // Clear any output-only channels
    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear(i, 0, buffer.getNumSamples());

    // Pass-through processing:
    // Apply gain to all channels (default: unity gain = 1.0)
    for (int channel = 0; channel < totalNumInputChannels; ++channel)
    {
        auto* channelData = buffer.getWritePointer(channel);
        for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
        {
            channelData[sample] *= gainParam;
        }
    }

    // Handle MIDI input if enabled
    if ({{MIDI_INPUT}})
    {
        for (const auto metadata : midiMessages)
        {
            const auto msg = metadata.getMessage();
            // Process MIDI messages here as needed
            // This is where you would implement synth logic or effect parameter control
        }
    }
}

/**
 * Bypassed processing
 * When plugin is bypassed, just pass audio through unmodified
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::processBlockBypassed(juce::AudioBuffer<float>& buffer,
                                                                 juce::MidiBuffer&)
{
    // In bypass mode, audio passes unchanged
    // The buffer is already in the correct state
}

/**
 * Create the UI editor
 */
juce::AudioProcessorEditor* {{PLUGIN_NAME_IDENTIFIER}}Processor::createEditor()
{
    return new {{PLUGIN_NAME_IDENTIFIER}}Editor(*this);
}

/**
 * Get plugin state for saving
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::getStateInformation(juce::MemoryBlock& destData)
{
    // Serialize your plugin's state here
    // This is called when saving plugin presets/sessions
    juce::ValueTree state("{{PLUGIN_NAME_IDENTIFIER}}_State");
    
    // Store parameter values
    state.setProperty("gain", gainParam, nullptr);
    
    // Copy to memory block
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

/**
 * Set plugin state for loading
 */
void {{PLUGIN_NAME_IDENTIFIER}}Processor::setStateInformation(const void* data, int sizeInBytes)
{
    // Restore your plugin's state
    // This is called when loading plugin presets/sessions
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));
    
    if (xmlState != nullptr)
    {
        if (xmlState->hasTagName("{{PLUGIN_NAME_IDENTIFIER}}_State"))
        {
            gainParam = (float)xmlState->getDoubleAttribute("gain", 1.0);
        }
    }
}

/**
 * Plugin factory
 * This creates the processor instance
 */
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new {{PLUGIN_NAME_IDENTIFIER}}Processor();
}
