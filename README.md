When replacing nodes in a Vega spec by replacing data via a signal, it appears that some nodes are not being garbage collected:

https://github.com/user-attachments/assets/3f3548fd-eae3-4aa7-8b4e-732b704d2e5f

Steps to reproduce:
- `$ npm run dev`
- Open Chrome Devtools, go to Performance tab, record performance
- Manually change signal value or use the auto button to change on a timer
- Stop recording performance, review the "Nodes" graph in the Memory tab
