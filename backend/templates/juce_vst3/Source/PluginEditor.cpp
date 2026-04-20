#include "PluginEditor.h"

/**
 * Editor constructor
 */
{{PLUGIN_NAME_IDENTIFIER}}Editor::{{PLUGIN_NAME_IDENTIFIER}}Editor({{PLUGIN_NAME_IDENTIFIER}}Processor& proc)
    : AudioProcessorEditor(&proc), processor(proc)
{
    // Set editor size
    setSize(500, 300);

    // Title label
    titleLabel.setText("{{PLUGIN_NAME}}", juce::dontSendNotification);
    titleLabel.setFont(juce::Font(24.0f, juce::Font::bold));
    titleLabel.setJustificationType(juce::Justification::centred);
    addAndMakeVisible(titleLabel);

    // Info label
    infoLabel.setText("{{COMPANY_NAME}} - VST3 {{#if IS_SYNTH}}Synthesizer{{else}}Effect{{/if}}", 
                      juce::dontSendNotification);
    infoLabel.setFont(juce::Font(14.0f));
    infoLabel.setJustificationType(juce::Justification::centred);
    addAndMakeVisible(infoLabel);
}

/**
 * Editor destructor
 */
{{PLUGIN_NAME_IDENTIFIER}}Editor::~{{PLUGIN_NAME_IDENTIFIER}}Editor()
{
}

/**
 * Paint the editor background and components
 */
void {{PLUGIN_NAME_IDENTIFIER}}Editor::paint(juce::Graphics& g)
{
    // Background gradient
    g.fillAll(juce::Colour(0xff1e1e1e));

    // Draw a nice border
    g.setColour(juce::Colour(0xff3498db));
    g.drawRect(getLocalBounds(), 2);

    // Decorative header
    juce::Rectangle<int> headerArea(0, 0, getWidth(), 60);
    g.setColour(juce::Colour(0xff2c3e50));
    g.fillRect(headerArea);

    // Add some visual appeal
    g.setColour(juce::Colour(0xff3498db).withAlpha(0.3f));
    for (int i = 0; i < getWidth(); i += 20)
    {
        g.drawLine((float)i, 60.0f, (float)(i + 10), 65.0f, 1.0f);
    }
}

/**
 * Layout UI components
 */
void {{PLUGIN_NAME_IDENTIFIER}}Editor::resized()
{
    auto area = getLocalBounds();

    // Title in top section
    auto headerArea = area.removeFromTop(80);
    titleLabel.setBounds(headerArea.removeFromTop(40).reduced(10));
    infoLabel.setBounds(headerArea.removeFromTop(30).reduced(10));

    // Additional components go here
    // Example: buttons, sliders, etc.

    // You can add your plugin controls below
    // auto controlArea = area.removeFromTop(100);
}
