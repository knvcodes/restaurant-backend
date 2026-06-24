| Command                   | Purpose                               | Example                                       |
| ------------------------- | ------------------------------------- | --------------------------------------------- |
| `SET key value`           | Store a value                         | `SET forgot_password:abc123 userId456`        |
| `SETEX key seconds value` | Store with TTL (use this for tokens)  | `SETEX forgot_password:abc123 3600 userId456` |
| `GET key`                 | Retrieve a value                      | `GET forgot_password:abc123`                  |
| `DEL key`                 | Delete a key                          | `DEL forgot_password:abc123`                  |
| `EXPIRE key seconds`      | Set TTL on existing key               | `EXPIRE forgot_password:abc123 3600`          |
| `TTL key`                 | Check remaining time                  | `TTL forgot_password:abc123`                  |
| `KEYS pattern`            | Find keys (avoid in prod, use `SCAN`) | `KEYS forgot_password:*`                      |
