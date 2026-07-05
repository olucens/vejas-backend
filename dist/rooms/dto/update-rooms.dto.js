"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rooms_dto_1 = require("./create-rooms.dto");
class UpdateRoomDto extends (0, mapped_types_1.PartialType)(create_rooms_dto_1.CreateRoomDto) {
}
exports.UpdateRoomDto = UpdateRoomDto;
//# sourceMappingURL=update-rooms.dto.js.map