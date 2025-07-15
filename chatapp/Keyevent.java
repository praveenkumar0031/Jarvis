package chatapp;

import java.awt.*;
import java.awt.event.*;

public class Keyevent extends Frame implements KeyListener {

    public Keyevent() {
        setTitle("Key Event Demo");
        setSize(400, 300);
        addKeyListener(this); // Registering this class as the KeyListener
        setFocusable(true); // Ensure the component can receive focus
        setVisible(true);
    }

    @Override
    public void keyPressed(KeyEvent e) {
        System.out.println("Key Pressed: " + KeyEvent.getKeyText(e.getKeyCode()));
    }

    @Override
    public void keyReleased(KeyEvent e) {
        System.out.println("Key Released: " + KeyEvent.getKeyText(e.getKeyCode()));
    }

    @Override
    public void keyTyped(KeyEvent e) {
        System.out.println("Key Typed: " + e.getKeyChar());
    }

    public static void main(String[] args) {
        new Keyevent();
    }
}